#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ==================== 配置项（可根据你的需求修改） ====================
const SCRIPT_PATH = path.join(__dirname, '../scripts/auto-switch-node.sh');
const AUTO_RUN_COMMAND = `source ${SCRIPT_PATH}`;
// 开始标记和结束标记（精准界定专属配置范围）
const CONFIG_START_MARK = '# AUTO-RUN-TERMINAL-CONFIG (START DO NOT DELETE)';
const CONFIG_END_MARK = '# AUTO-RUN-TERMINAL-CONFIG (END DO NOT DELETE)';

// ==================== 核心逻辑 ====================
const zshrcPath = path.join(process.env.HOME, '.zshrc');

// 读取.zshrc文件内容（如果文件不存在则创建）
function readZshrc() {
  try {
    if (fs.existsSync(zshrcPath)) {
      return fs.readFileSync(zshrcPath, 'utf8');
    }
    fs.writeFileSync(zshrcPath, '', 'utf8');
    return '';
  } catch (err) {
    console.error('❌ 读取/创建.zshrc文件失败：', err.message);
    process.exit(1);
  }
}

// 写入配置到.zshrc（精准覆盖旧版本内容）
function writeToZshrc() {
  try {
    const existingContent = readZshrc();
    let cleanContent = existingContent;

    // 精准清理旧版本配置：只删除开始标记和结束标记之间的内容
    if (existingContent.includes(CONFIG_START_MARK) && existingContent.includes(CONFIG_END_MARK)) {
      console.log('🔄 发现旧配置，正在更新...');
      const startIndex = existingContent.indexOf(CONFIG_START_MARK);
      const endIndex = existingContent.indexOf(CONFIG_END_MARK) + CONFIG_END_MARK.length;
      // 保留标记之前的内容 + 标记之后的内容（删除中间的旧配置）
      cleanContent = existingContent.slice(0, startIndex) + existingContent.slice(endIndex);
      // 去除多余的空行，避免文件冗余
      cleanContent = cleanContent.replace(/\n+/g, '\n').trim() + '\n';
    }

    // 拼接新版本的配置内容（包含开始/结束标记）
    const newConfig = `
${CONFIG_START_MARK}
# 终端打开时自动执行的脚本（由auto-run-terminal包配置）
${AUTO_RUN_COMMAND}

# cd命令钩子：切换目录时自动执行脚本
auto_switch_cd_hook() {
    source "${SCRIPT_PATH}"
}
autoload -Uz add-zsh-hook
add-zsh-hook chpwd auto_switch_cd_hook
${CONFIG_END_MARK}
`;

    // 写入清理后的内容 + 新版本配置
    fs.writeFileSync(zshrcPath, cleanContent + newConfig, 'utf8');
    console.log('✅ 成功将自动执行脚本配置到.zshrc');
  } catch (err) {
    console.error('❌ 写入.zshrc失败：', err.message);
    process.exit(1);
  }
}

// 执行source ~/.zshrc让配置立即生效
function sourceZshrc() {
  try {
    execSync(`zsh -c 'source ${zshrcPath}'`, { stdio: 'pipe' });
    console.log('✅ 配置已立即生效，打开新终端即可自动执行脚本');
  } catch (err) {
    console.warn('⚠️ 配置已写入.zshrc，但即时生效失败，请手动执行 source ~/.zshrc 或重启终端');
    console.warn('   错误信息：', err.message);
  }
}

// 主函数
function main() {
  console.log('🔧 开始配置终端自动执行脚本...');
  writeToZshrc();
  sourceZshrc();
  console.log('\n🎉 配置完成！以后打开VS Code终端/系统终端都会自动执行脚本');
}

// 执行主函数
main();