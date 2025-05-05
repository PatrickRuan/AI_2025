# server_agent.py
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/.well-known/agent.json', methods=['GET'])
def agent_card():
    return jsonify({
        "name": "EchoAgent",
        "description": "An agent that echoes back messages.",
        #"endpoint": "http://localhost:5000/tasks/send",
        "endpoint": "http://127.0.0.1:5000/tasks/send",  # ← 改這裡！

        "capabilities": ["echo"]
    })

@app.route('/tasks/send', methods=['POST'])
def handle_task():
    data = request.get_json()
    user_message = data.get('message', {}).get('parts', [{}])[0].get('text', '')
    response = {
        "task_id": data.get("task_id"),
        "status": "completed",
        "message": {
            "role": "agent",
            "parts": [
                {"text": f"Echo: {user_message}"}
            ]
        }
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000)