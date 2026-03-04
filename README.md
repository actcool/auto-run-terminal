# auto-run-terminal

> Mac终端/VS Code终端打开时自动执行指定脚本，安装即生效

这是一个为macOS用户设计的终端自动执行脚本工具，可以在打开终端或VS Code终端时自动检测并切换到项目指定的Node.js版本。

## ✨ 功能特性

- **自动Node.js版本切换**：根据项目`package.json`中的`nodeVersion`字段自动切换Node.js版本
- **多环境支持**：支持系统终端、iTerm2、VS Code终端等多种终端环境
- **零配置使用**：安装后自动配置，无需手动设置
- **智能检测**：只在包含`package.json`的目录中执行，避免不必要的操作
- **优雅降级**：未安装nvm时提供友好提示，不影响正常使用

## 🚀 快速开始

### 安装

```bash
npm install -g auto-run-terminal
```

或者作为项目依赖安装：

```bash
npm install auto-run-terminal
```

### 使用

1. 在项目根目录的`package.json`中添加`nodeVersion`字段：

```json
{
  "name": "your-project",
  "nodeVersion": "18",
  // 其他配置...
}
```

2. 安装完成后，每次打开终端或VS Code终端时，脚本会自动执行

## 🔧 工作原理

该工具通过以下步骤实现自动执行：

1. **安装阶段**：`npm install`时会触发`postinstall`脚本
2. **配置阶段**：自动修改用户`~/.zshrc`文件，添加自动执行配置
3. **执行阶段**：每次打开终端时，自动检测当前目录是否有`package.json`
4. **版本切换**：读取`nodeVersion`字段并使用nvm切换到指定版本

## 📁 项目结构

```
auto-run-terminal/
├── bin/
│   └── auto-config.js          # 安装配置脚本
├── scripts/
│   ├── auto-switch-node.sh     # Bash版本自动切换脚本
│   ├── my-auto-script.js       # Node.js版本自动切换脚本
│   └── my-auto-script.sh       # 备用Bash版本自动切换脚本
├── package.json                # 项目配置
└── README.md                   # 项目文档
```

## 📝 配置说明

### package.json配置

在项目的`package.json`中添加`nodeVersion`字段：

```json
{
  "nodeVersion": "18"
}
```

支持多种格式：
- `"18"` - 使用Node.js 18.x版本
- `"v16.20.0"` - 使用指定版本
- `"lts"` - 使用LTS版本

### 环境要求

- macOS系统
- zsh shell（macOS默认）
- nvm（Node Version Manager）已安装

## 🔍 故障排除

### nvm未安装

如果提示"未检测到 nvm"，请按以下步骤安装：

```bash
# 使用curl安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 或使用wget安装
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装后重启终端或执行
source ~/.zshrc
```

### 配置未生效

如果配置未生效，请尝试：

```bash
# 手动source配置文件
source ~/.zshrc

# 或重启终端应用程序
```

### VS Code终端不生效

确保VS Code使用的是系统默认的zsh shell：

1. 打开VS Code设置
2. 搜索`terminal.integrated.defaultProfile.osx`
3. 设置为`zsh`

## 🛠️ 开发指南

### 项目安装

```bash
git clone <repository-url>
cd auto-run-terminal
npm install
```

### 本地测试

```bash
# 测试配置脚本
node bin/auto-config.js

# 测试自动切换脚本
./scripts/auto-switch-node.sh
```

### 构建发布

```bash
# 发布到npm
npm publish
```

## 🗑️ 卸载

### 自动卸载

使用npm卸载包时会自动执行卸载脚本，移除添加到`~/.zshrc`中的配置：

```bash
npm uninstall -g auto-run-terminal
```

或卸载项目依赖：

```bash
npm uninstall auto-run-terminal
```

### 手动卸载

如果需要手动卸载，可以执行：

```bash
node ./node_modules/auto-run-terminal/bin/uninstall.js
```

卸载脚本会：
1. 从`~/.zshrc`中移除auto-run-terminal相关的配置
2. 清理多余的空行，保持文件整洁
3. 提示重启终端或执行`source ~/.zshrc`使更改生效