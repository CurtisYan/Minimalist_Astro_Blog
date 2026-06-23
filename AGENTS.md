# AI 协作规范

## 目标

本仓库是一个 Minimalist Astro Blog 模板。AI 助手在修改代码、内容或配置时，应优先保持项目简洁、可读、可构建，并遵循现有 Astro 项目结构。

## 工作规则

- 修改前先查看相关文件和 `git status`，确认当前改动范围。
- 只修改与任务直接相关的文件，不随意重构无关代码。
- 中文、英文或中英双语内容必须保存为 UTF-8。
- 涉及界面、样式、文章内容或配置的改动，完成后优先运行 `npm run build` 验证。
- 不提交 `node_modules/`、`dist/`、`.astro/` 或日志文件。

## 自动提交与推送

每次 AI 完成一次有意义的修改后，都必须执行以下流程：

1. 运行 `git status --short` 检查变更。
2. 运行合适的验证命令，例如 `npm run build`。
3. 使用明确的提交信息提交本次修改。
4. 推送到 GitHub 远程仓库。

默认命令：

```bash
git add -A
git commit -m "describe the change"
git push
```

如果是第一次初始化仓库，使用：

```bash
git init
git branch -M main
git remote add origin git@github.com:CurtisYan/Minimalist_Astro_Blog.git
git add -A
git commit -m "first commit"
git push -u origin main
```

## 提交信息规范

提交信息要简短、具体，优先使用英文动词短语，例如：

- `add ai collaboration guidelines`
- `update blog configuration`
- `fix post layout spacing`
- `refresh README content`

## 安全边界

- 不要覆盖用户未说明要替换的内容。
- 不要执行破坏性 Git 命令，例如 `git reset --hard`，除非用户明确要求。
- 如果推送失败，先报告失败原因，再根据错误信息处理 SSH、权限或远程仓库问题。
