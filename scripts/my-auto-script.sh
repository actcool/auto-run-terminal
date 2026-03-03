# ========== 自动加载 package.json 中的 nodeVersion 并切换 nvm 版本 ==========
function auto-switch-node-version() {
    # 1. 检查当前目录是否存在 package.json 文件
    if [ -f "./package.json" ]; then
        echo "🔍 发现 package.json 文件，开始读取 nodeVersion 字段..."
        
        # 2. 读取 package.json 中的 nodeVersion 字段（使用 awk 解析，无需额外安装依赖）
        # 兼容格式："nodeVersion": "18" 或 "nodeVersion": "v16.20.0" 等
        NODE_VERSION=$(awk -F '"' '/"nodeVersion":/ {print $4}' ./package.json)
        
        # 3. 检查是否成功读取到 nodeVersion 字段
        if [ -n "$NODE_VERSION" ]; then
            echo "📌 读取到 nodeVersion：$NODE_VERSION"
            
            # 4. 检查 nvm 是否已安装（避免 nvm 未配置时报错）
            if command -v nvm &> /dev/null; then
                echo "🔧 执行 nvm use $NODE_VERSION..."
                # 执行 nvm use，屏蔽无关输出（仅保留关键提示）
                nvm use "$NODE_VERSION" &> /dev/null
            else
                echo "⚠️  未检测到 nvm，请先安装配置 nvm 后再使用该功能"
            fi
        else
            echo "ℹ️  package.json 中未找到 nodeVersion 字段，跳过 nvm 切换"
        fi
    else
        echo "ℹ️  当前目录无 package.json 文件，跳过 nvm 切换"
    fi
    
    # 5. 最终执行 node -v 输出当前 node 版本
    echo "======================================"
    echo "当前 Node 版本："
    node -v
    echo "======================================"
}

# 终端启动时自动调用该函数
auto-switch-node-version