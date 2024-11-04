# interpreter.py
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime

# MongoDB URI
uri = "mongodb+srv://kchinnakotla6:{password}aiatl-cluster.j6zwn.mongodb.net/?retryWrites=true&w=majority&appName=AIATL-cluster"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["AIATL"]
users_collection = db["users"]

def create_user(id, name, password):
    user = {
        "_id": id,  # Using unique ID (email or username)
        "name": name,
        "password": password,
        "preferred_personas": [],
        "conversation_history": [],
        "feedback_history": [],
        "created_at": datetime.utcnow()
    }
    try:
        users_collection.insert_one(user)
        print(f"User {name} added!")
    except Exception as e:
        print(f"Error adding user: {e}")

def update_preferred_personas(name, new_personas):
    # Update the user's preferred_personas field with the new personas
    result = users_collection.update_one(
        {"name": name},  # Find the user by their unique ID
        {"$set": {"preferred_personas": new_personas}}  # Update preferred_personas
    )

    if result.matched_count > 0:
        print(f"Successfully updated preferred personas for user {name}.")
    else:
        print(f"User with ID {name} not found.")

def update_conversation_history(user_name, new_message, sender):
    # Update the user's conversation_history field by appending the new message
    result = users_collection.update_one(
        {"name": user_name},  # Find the user by their name
        {"$push": {"conversation_history": {
            "message": new_message,
            "timestamp": datetime.utcnow(),  # Optionally store a timestamp
            "sender" : sender
        }}}
    )

    if result.matched_count > 0:
        print(f"Successfully updated conversation history for user '{user_name}'.")
    else:
        print(f"User with name '{user_name}' not found.")

def update_feedback_history(user_name,new_feedback,sender):
    result = users_collection.update_one(
        {"name" : user_name},
        {"$push": {"feedback_history": {
            "feedback" : new_feedback,
            "timestamp" : datetime.utcnow(),
            "sender" : sender
        }}
        }
    )
    if result.matched_count > 0:
        print(f"Successfully updated feedback history for user '{user_name}'.")
    else:
        print(f"User with name '{user_name}' not found.")

def get_conversation_history(user_name):
    # Find the user document by name
    res = []
    user = users_collection.find_one({"name": user_name})

    if user:
        # Access the conversation_history field
        conversation_history = user.get("conversation_history", [])
        for entry in conversation_history:
            if entry.get("sender") == 'user':
                res.append(entry['message'])
        # Print or return the conversation history
        return res
    else:
        print(f"No user found with name '{user_name}'.")
        return []
    
from openai import OpenAI
client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)
LLM = "meta/llama-3.2-3b-instruct"

def chat_with_bot(user, bot, inputs, user_response):
    update_preferred_personas(user,bot)
    # Ensure past_inputs is a list of strings
    if isinstance(inputs, list):
        # Join the list into a single string, separating with a comma or line break
        inputs = ", ".join(inputs)
    else:
        inputs = inputs  # Fallback in case it's not a list
    
    update_conversation_history(user,user_response,"user")

    # Construct the prompt for the chatbot
    
    prompt = f"Act like a {bot}, and generate either a question or statement based off of these past responses: {inputs}. Make it conversational"

    # Prompt the chatbot for an initial response
    chatBotResponse = client.chat.completions.create(
        model=LLM,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        top_p=1,
        max_tokens=500,
        stream=True
    )

    # Collect and print the bot's response
    response_str = ""
    for chunk in chatBotResponse:
        if chunk.choices[0].delta.content is not None:
            response_str += chunk.choices[0].delta.content
    
    update_conversation_history(user,response_str,bot)


    # Use user response for feedback
    ideal_response_prompt = (
        f"Based on {response_str}, compare my response, {user_response}, "
        "with how you would respond to the prompt. "
        "Give a quick debrief of my response and offer some tips to improve. "
        "Don't show any implementation details. Just output the debrief, tips, and example or improved response."
    )

    # Get feedback from the chatbot
    comparison = client.chat.completions.create(
        model=LLM,
        messages=[{"role": "user", "content": ideal_response_prompt}],
        temperature=0.5,
        top_p=1,
        max_tokens=500,
        stream=True
    )

    # Collect and print feedback from the chatbot
    feedback_str = ""
    for chunk in comparison:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
            feedback_str += chunk.choices[0].delta.content

    update_feedback_history(user,feedback_str,bot)
