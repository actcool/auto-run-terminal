#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execa } = require('execa');

// ==================== 配置项（可根据你的需求修改） ====================
// 1. 要让用户终端自动执行的命令/脚本（写绝对路径！）
// 注意：这里的__dirname是包安装后的目录，需拼接脚本的绝对路径
const AUTO_RUN_COMMAND = `node ${path.join(__dirname, '../scripts/my-auto-script.js')}`;
// 2. 标记：用于判断是否已经配置过，避免重复添加
const CONFIG_MARK = '# AUTO-RUN-TERMINAL-CONFIG (DO NOT DELETE)';

// ==================== 核心逻辑 ====================
// 1. 获取用户的.zshrc文件路径（Mac用户的zsh配置文件）
const zshrcPath = path.join(process.env.HOME, '.zshrc');

// 2. 读取.zshrc文件内容（如果文件不存在则创建）
function readZshrc() {
  try {
    if (fs.existsSync(zshrcPath)) {
      return fs.readFileSync(zshrcPath, 'utf8');
    }
    // 文件不存在则创建空文件
    fs.writeFileSync(zshrcPath, '', 'utf8');
    return '';
  } catch (err) {
    console.error('❌ 读取/创建.zshrc文件失败：', err.message);
    process.exit(1);
  }
}

// 3. 写入配置到.zshrc（避免重复）
function writeToZshrc(content) {
  try {
    const existingContent = readZshrc();
    // 如果已经配置过，直接返回
    if (existingContent.includes(CONFIG_MARK)) {
      console.log('✅ 已配置过自动执行脚本，无需重复配置');
      return;
    }
    // 追加配置（加标记+自动执行命令）
    const newContent = `
${CONFIG_MARK}
# 终端打开时自动执行的脚本（由auto-run-terminal包配置）
${AUTO_RUN_COMMAND}
`;
    fs.appendFileSync(zshrcPath, newContent, 'utf8');
    console.log('✅ 成功将自动执行脚本配置到.zshrc');
  } catch (err) {
    console.error('❌ 写入.zshrc失败：', err.message);
    process.exit(1);
  }
}

// 4. 执行source ~/.zshrc让配置立即生效
async function sourceZshrc() {
  try {
    // 用execa执行source命令（需要指定shell为zsh）
    await execa('zsh', ['-c', `source ${zshrcPath}`]);
    console.log('✅ 配置已立即生效，打开新终端即可自动执行脚本');
  } catch (err) {
    console.warn('⚠️ 配置已写入.zshrc，但即时生效失败，请手动执行 source ~/.zshrc 或重启终端');
    console.warn('   错误信息：', err.message);
  }
}

// 5. 主函数
async function main() {
  console.log('🔧 开始配置终端自动执行脚本...');
  writeToZshrc();
  await sourceZshrc();
  console.log('\n🎉 配置完成！以后打开VS Code终端/系统终端都会自动执行脚本');
}

// 执行主函数
main();