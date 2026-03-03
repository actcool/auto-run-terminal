#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

/**
 * 自动加载 package.json 中的 nodeVersion 并切换 nvm 版本
 */
function autoSwitchNodeVersion() {
    // 1. 检查当前目录是否存在 package.json 文件
    if (fs.existsSync('./package.json')) {
        console.log('🔍 发现 package.json 文件，开始读取 nodeVersion 字段...');
        
        try {
            // 2. 读取 package.json 文件
            const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
            
            // 3. 检查是否成功读取到 nodeVersion 字段
            if (packageJson.nodeVersion) {
                const nodeVersion = packageJson.nodeVersion;
                console.log(`📌 读取到 nodeVersion：${nodeVersion}`);
                
                // 4. 检查 nvm 是否已安装（避免 nvm 未配置时报错）
                try {
                    // 执行 nvm use，需要加载 shell 配置文件
                    execSync(`source ~/.nvm/nvm.sh && nvm use ${nodeVersion}`, {
                        stdio: 'pipe',
                        shell: '/bin/zsh'
                    });
                    console.log(`🔧 已切换至 Node.js ${nodeVersion}`);
                    
                    // 重新加载 shell 环境并获取新的 Node 版本
                    const newVersion = execSync(`source ~/.nvm/nvm.sh && node -v`, {
                        encoding: 'utf8',
                        shell: '/bin/zsh'
                    }).trim();
                    
                    // 设置环境变量以便当前会话使用
                    process.env.PATH = execSync(`source ~/.nvm/nvm.sh && echo $PATH`, {
                        encoding: 'utf8',
                        shell: '/bin/zsh'
                    }).trim();
                    
                    console.log(`✅ 当前会话 Node 版本已更新为：${newVersion}`);
                } catch (error) {
                    // 检查是否是 nvm 命令不存在
                    if (error.message.includes('command not found') || error.message.includes('nvm')) {
                        console.log('⚠️ 未检测到 nvm，请先安装配置 nvm 后再使用该功能');
                    } else {
                        console.log(`⚠️ 切换 Node 版本失败：${error.message}`);
                    }
                }
            } else {
                console.log('ℹ️ package.json 中未找到 nodeVersion 字段，跳过 nvm 切换');
            }
        } catch (error) {
            console.log('❌ 解析 package.json 文件失败：', error.message);
        }
    } else {
        console.log('ℹ️ 当前目录无 package.json 文件，跳过 nvm 切换');
    }
    
    // 5. 最终执行 node -v 输出当前 node 版本
    console.log('======================================');
    console.log('当前 Node 版本：');
    try {
        const currentVersion = execSync('node -v', { encoding: 'utf8' }).trim();
        console.log(currentVersion);
    } catch (error) {
        console.log('❌ 获取 Node 版本失败：', error.message);
    }
    console.log('======================================');
}

// 执行函数
autoSwitchNodeVersion();

module.exports = { autoSwitchNodeVersion };