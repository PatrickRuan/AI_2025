1. A2A, agent to agent

@terminal 1
execute: 
python server_agent.py

then, 
@terminal 2, execute:
python client_agent.py

get:
Raw response text: {"capabilities":["echo"],"description":"An agent that echoes back messages.","endpoint":"http://127.0.0.1:5000/tasks/send","name":"EchoAgent"}

Discovered agent: EchoAgent
Agent response: Echo: Hello, Agent!

======================================================

2. MCP, model context protocol:
需要先安裝 fastmcp: pip install fastmcp
terminal 1: python server_mcp.py
terminal 2: python client_mcp.py server_mcp.py



