# server.py
from fastmcp import FastMCP

# 初始化 MCP 伺服器，名稱可自訂
mcp = FastMCP("WeatherServer")

@mcp.tool(name="get_forecast")
def get_forecast(city: str) -> dict:
    """
    取得指定城市的天氣預報（模擬資料）
    """
    # 回傳模擬的氣象資訊
    return {"city": city, "forecast": "Sunny", "temperature": "25°C"}

@mcp.tool(name="get_alerts")
def get_alerts(city: str) -> list:
    """
    取得指定城市的天氣警報（模擬資料）
    """
    # 回傳模擬的警報列表
    return ["No alerts"]

if __name__ == "__main__":
    # 啟動 MCP 伺服器，預設透過 STDIO 進行 JSON-RPC 通訊
    mcp.run()