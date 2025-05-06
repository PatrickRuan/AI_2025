#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import asyncio
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main(server_script_path: str):
    """
    啟動一個 MCP Client，透過 STDIO 與指定的 server.py 建立連線，
    列出可用工具並呼叫 get_forecast 取得天氣預報。
    """
    # 根據檔案副檔名決定以 python3 還是 node 執行 server
    command = "python" if server_script_path.endswith(".py") else "node"
    params = StdioServerParameters(command=command, args=[server_script_path])

    # 建立 STDIO 通道
    async with stdio_client(params) as (stdio, write):
        # 建立 MCP Session
        async with ClientSession(stdio, write) as session:
            # 初始化 MCP（協商能力與工具列表）
            await session.initialize()

            # 列出所有可用的工具名稱
            response = await session.list_tools()
            tools = [tool.name for tool in response.tools]
            print("Available tools:", tools)

            # 呼叫 get_forecast 工具並取得回傳結果
            result = await session.call_tool("get_forecast", {"city": "Taipei"})

            # result.content 是一個 TextContent list，取出第一項的 text 欄位
            if result.content and hasattr(result.content[0], "text"):
                raw = result.content[0].text
                try:
                    data = json.loads(raw)
                    print("Forecast for Taipei:", data)
                except json.JSONDecodeError:
                    # 如果不是合法 JSON，直接印出原始字串
                    print("Raw response:", raw)
            else:
                # 若回傳格式不同，直接印出整個 result
                print("Response:", result)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python client.py <path_to_server_script>")
        sys.exit(1)
    # 執行主程式
    asyncio.run(main(sys.argv[1]))