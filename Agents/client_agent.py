# client_agent.py
import requests
import uuid

def discover_agent():
    #response = requests.get('http://localhost:5000/.well-known/agent.json')
    response = requests.get('http://127.0.0.1:5000/.well-known/agent.json')
    print("Raw response text:", response.text)  # <-- 新增這行

    return response.json()

def send_task(agent_info, message_text):
    task_id = str(uuid.uuid4())
    payload = {
        "task_id": task_id,
        "message": {
            "role": "user",
            "parts": [
                {"text": message_text}
            ]
        }
    }
    response = requests.post(agent_info['endpoint'], json=payload)
    return response.json()

if __name__ == '__main__':
    agent_info = discover_agent()
    print(f"Discovered agent: {agent_info['name']}")
    response = send_task(agent_info, "中大的同學好!")
    print(f"Agent response: {response['message']['parts'][0]['text']}")