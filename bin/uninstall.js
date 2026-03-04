#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ==================== 配置项 ====================
const CONFIG_START_MARK = '# AUTO-RUN-TERMINAL-CONFIG (START DO NOT DELETE)';
const CONFIG_END_MARK = '# AUTO-RUN-TERMINAL-CONFIG (END DO NOT DELETE)';

// ==================== 核心逻辑 ====================
const zshrcPath = path.join(process.env.HOME, '.zshrc');

// 读取.zshrc文件内容
function readZshrc() {
  try {
    if (fs.existsSync(zshrcPath)) {
      return fs.readFileSync(zshrcPath, 'utf8');
    }
    return '';
  } catch (err) {
    console.error('❌ 读取.zshrc文件失败：', err.message);
    return '';
  }
}

// 从.zshrc中移除配置
function removeConfigFromZshrc() {
  try {
    const existingContent = readZshrc();
    
    // 检查是否存在配置标记
    if (!existingContent.includes(CONFIG_START_MARK) || !existingContent.includes(CONFIG_END_MARK)) {
      console.log('ℹ️  未找到auto-run-terminal的配置，无需卸载');
      return;
    }

    console.log('🔍 发现auto-run-terminal配置，正在移除...');
    
    // 找到配置的开始和结束位置
    const startIndex = existingContent.indexOf(CONFIG_START_MARK);
    const endIndex = existingContent.indexOf(CONFIG_END_MARK) + CONFIG_END_MARK.length;
    
    // 移除配置内容（从开始标记到结束标记）
    let cleanContent = existingContent.slice(0, startIndex) + existingContent.slice(endIndex);
    
    // 清理多余的空行，保留最多两个连续空行
    cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n').trim() + '\n';
    
    // 写回清理后的内容
    fs.writeFileSync(zshrcPath, cleanContent, 'utf8');
    
    console.log('✅ 成功从.zshrc中移除auto-run-terminal配置');
  } catch (err) {
    console.error('❌ 移除配置失败：', err.message);
  }
}

// 主函数
function main() {
  console.log('🗑️  开始卸载auto-run-terminal配置...');
  removeConfigFromZshrc();
  console.log('\n🎉 卸载完成！auto-run-terminal的配置已从.zshrc中移除');
  console.log('💡 请重启终端或执行 source ~/.zshrc 使更改生效');
}

// 执行主函数
main();