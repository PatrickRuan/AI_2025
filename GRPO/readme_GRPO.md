程式 1. 
1.Llama3_1_(8B)_GRPO.ipynb
模型、資料、訓練
結果可以存成 hugging face 的模型，也可以存成 gguf
這裡只存成 hugging face 的模型 (model1.zip) 提供給程式 2 使用。

程式 2.
2.NCU_GRPO_GGUF.ipynb
安裝 llama.cpp
取得 convert_hf_to_gguf.py 
將 解壓縮的 model1.zip 的目錄 做出一個 gguf
安裝 ollama
給 ollama 與 gguf 位置做出連結與處理 (through Modelfile)
透過 localhost:11434 呼叫模型

會有 程式 3. 
0_Llama3_2_(3B)_GRPO_ollama.ipynb
主要是整合 程式 1 與 程式 2
中間直接生成 .gguf 檔案，所以後半部不需要 llama.cpp 與 convert_hf_to_gguf.py 的使用。
但是目前 colab 跑不完。
