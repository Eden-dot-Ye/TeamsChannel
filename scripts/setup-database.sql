-- Clean existing data
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create channels table
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6264A7',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table for AI-powered categorization
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6264A7',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_channel_id ON messages(channel_id);
CREATE INDEX idx_messages_category ON messages(category);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_channels_position ON channels(position);

-- Insert sample categories (category name equals channel name)
INSERT INTO categories (name, description, color) VALUES
  ('技术讨论', '技术方案、架构与实现细节的讨论', '#6264A7'),
  ('产品设计', '交互、视觉与产品体验相关话题', '#8764B8'),
  ('Bug反馈', '问题复现、排查与修复进度', '#C4314B'),
  ('文档分享', '规范、指南、读书笔记与资料链接', '#0078D4'),
  ('生活日常', '团队日常、活动与轻松交流', '#00B294'),
  ('项目更新', '里程碑、进展与计划同步', '#F59B00');

-- Insert sample channels (match category names)
INSERT INTO channels (name, description, icon, color, position) VALUES
  ('技术讨论', '架构设计、性能优化与技术选型', '💻', '#6264A7', 0),
  ('产品设计', '需求拆解、交互方案与体验优化', '🎨', '#8764B8', 1),
  ('Bug反馈', '缺陷跟踪、日志分析与修复方案', '🐛', '#C4314B', 2),
  ('文档分享', '开发规范、知识沉淀与资料汇总', '📚', '#0078D4', 3),
  ('生活日常', '咖啡角、团队活动与轻松话题', '☕', '#00B294', 4),
  ('项目更新', '版本里程碑、风险提示与进度同步', '🗓️', '#F59B00', 5);

-- Insert sample messages
INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '林晓', 'LX', '## 网关限流讨论
最近压测发现高峰期的请求会触发下游保护，尤其是批量导入场景。我们是否需要在API网关层做双向限流与熔断？如果做的话，限流粒度是按用户、按租户还是按接口？目前日志里有一部分重试导致的雪崩，失败后客户端会在2秒内重复请求三次，造成瞬时峰值。

**关注点**：要不要区分读写；是否需要对内部服务放宽；以及失败时的降级提示。

*建议草案*：先在网关做软限流，再由下游做硬保护。

```yaml
limit: 200rps
burst: 400
retry_window: 5s
```

请大家补充更合理的阈值与监控指标。另一个想法是把限流策略按业务线拆分，避免共享阈值导致互相影响。之后我会整理一份对比表，包含用户体验、成本和实施复杂度。'
FROM channels c WHERE c.name = '技术讨论' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '陈奕', 'CY', '## 分层缓存方案说明
目前单一LRU在热点切换时抖动明显，我建议改为分层缓存：本地内存缓存负责超热数据，Redis负责热数据，冷数据走DB。这样能减小网络抖动并降低数据库压力，同时还能对不同层设置不同TTL。

**关键点**：一致性策略要明确，可先采用读路径旁路缓存，写路径异步失效；对高频更新的key增加版本号。

*需要验证*：冷启动时命中率变化，以及跨机房延迟。

```text
L1: 30s, L2: 5m, DB: authoritative
```

如果大家认可，我会补一个灰度实验方案和指标面板草图，同时拉一场短会对齐迁移步骤与回滚策略，避免影响正在进行的促销活动。'
FROM channels c WHERE c.name = '技术讨论' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '王然', 'WR', '## 顶部搜索交互补充
交互稿里顶部搜索框是否需要支持历史记录与快捷过滤？目前方案只有输入框，但用户反馈查找频道会重复输入关键词。我倾向加入最近搜索与常用筛选标签，保持简洁同时提高命中率。

**问题**：历史记录保留多少条合适？是否需要支持一键清除？是否显示最近访问的频道作为快捷入口？

*个人建议*：默认展示最近5条，超过部分隐藏；移动端只显示最近3条。

```text
状态: 未输入 -> 展示历史
输入中 -> 展示建议
```

请大家从可用性和隐私角度帮忙评估，如果担心隐私问题，可以考虑仅本地保存历史记录，不上传服务端。'
FROM channels c WHERE c.name = '产品设计' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '苏晴', 'SQ', '## 频道预览卡片视觉建议
新版频道预览卡片的层级感我建议加轻微阴影和细边框，同时在悬停时放大到95%并提高不透明度，这样更贴近Teams的卡片风格。卡片内部的消息摘要建议最多三行，超出截断，避免左右预览区域太乱。

**细节**：标题用半粗体，描述用次级灰，消息内容用略深灰；卡片顶部加入小图标标记频道类型。

*可选*：在卡片右下角加入轻微渐变遮罩，提升文字可读性。

```css
box-shadow: 0 12px 30px rgba(0,0,0,.08)
```

欢迎补充其他Teams风格细节，比如分割线粗细、头像大小以及滚动时的固定栏行为。'
FROM channels c WHERE c.name = '产品设计' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '周航', 'ZH', '## 空内容发布问题
用户提交空内容仍然能发布，后端没有校验。复现路径：进入新建帖子页面，删除输入内容后直接点发布，接口返回成功但消息内容为空。建议前端增加最小字数校验，后端也要加约束，避免脏数据进入消息表。

**复现步骤**：1) 进入新建帖子 2) 删除文本 3) 点击发布 4) 刷新后可见空消息。

*修复建议*：前端按钮禁用 + 后端校验并返回400。

```ts
if (!content.trim()) return 400
```

需要安排在本周迭代内修复，避免测试数据污染后续的分类推荐效果。'
FROM channels c WHERE c.name = 'Bug反馈' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '吕琪', 'LQ', '## 移动端预览跳转错误
移动端点击频道预览会跳错频道。现象是：右侧预览点击后进入了左侧频道，可能是索引偏移或者动画状态未同步。我录了屏并附上步骤：打开第二个频道，快速滑动预览，再点击右侧卡片，会进入错误频道。

**怀疑点**：动画切换时currentIndex尚未更新，导致点击事件读取旧索引。

*建议*：点击预览时直接传入目标频道ID，避免依赖当前索引。

```js
onClick={() => onChannelChange(targetIndex)}
```

请大家确认是否还有其他设备复现，最好标注机型、系统版本和是否开启低电量模式。'
FROM channels c WHERE c.name = 'Bug反馈' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '杜珂', 'DK', '## Supabase初始化文档更新
整理了一份Supabase初始化步骤，包含环境变量配置、SQL初始化脚本、RLS策略示例以及本地调试注意事项。文档已放到共享资料里，欢迎补充你们踩过的坑，比如本地重置数据库或者部署时的权限问题。

**包含内容**：项目初始化命令、表结构迁移顺序、RLS策略示例、常见报错排查。

*提示*：在本地调试时，建议将匿名key放在.env.local，避免误提交。

```sql
create policy "read" on messages for select using (true);
```

欢迎评论区补充最佳实践，如果需要我也可以把排查流程做成一页速查卡。'
FROM channels c WHERE c.name = '文档分享' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '宋雪', 'SX', '## AI分类提示词最佳实践
AI分类提示词最佳实践已更新，加入了类别描述、反例、以及如何处理多意图消息的说明。建议在prompt中强调“类别名称必须与频道一致”，并用简短理由返回。大家如果有新的案例或更好的指令模板，可以在文档评论里补充。

**要点**：类别列表必须包含描述；对多意图消息需选择“主意图”。

*示例*：

```json
{"categoryId":"...","confidence":0.82,"reasoning":"..."}
```

如果需要，我可以整理一份可复用的模板库，并配上示例数据方便你们快速对接。'
FROM channels c WHERE c.name = '文档分享' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '何佳', 'HJ', '## 午休小分队
午休有人一起去楼下新开的面馆吗？听说他们的番茄牛肉面挺不错，套餐还送小菜。我们大概12点10分出发，吃完回来还能顺路买杯咖啡。想一起的同学在下面回个表情。

**集合点**：电梯口；*预计时间*：12:10-13:00。

如果有人不吃辣，可以提前说，我去帮你们点单。

```text
预留座位数: 6
```

不去的也欢迎推荐附近好吃的，我们下周可以换一家试试。'
FROM channels c WHERE c.name = '生活日常' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '赵宁', 'ZN', '## 周五团建投票
周五团建投票，想去桌游还是KTV？目前看大家分成两派，我想做个快速统计：桌游偏轻松社交，KTV适合嗨一点。预算还够，再加个小吃拼盘。请在今天下午5点前回复，方便我订位置。

**规则**：每人投一票，评论区回复“桌游”或“KTV”。

*备选*：如果人数不足6人，改为轻量聚餐。

```text
截止时间: 17:00
```

谢谢大家配合，尽量提前回复，方便我确认人数和预算。'
FROM channels c WHERE c.name = '生活日常' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '杨晨', 'YC', '## v1.3 发布计划
下周准备发布v1.3，主要是频道预览升级和AI分类入口调整。当前风险点是预览卡片的性能与移动端适配，我会在周三前提交最终联调版本。若无阻塞，周四走灰度，周五全量发布。

**里程碑**：周二功能冻结；周三联调；周四灰度；周五全量。

*待确认*：是否需要开启A/B测试以评估预览卡片点击率变化。

```text
feature_flags: preview_v2, auto_route_post
```

欢迎提出其他风险点或依赖项，尤其是对移动端适配和性能监控的建议。'
FROM channels c WHERE c.name = '项目更新' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '高霖', 'GL', '## 分类模型性能风险
风险点：分类模型响应慢，平均在1.8秒左右。我们计划在服务侧增加短时缓存与相似度命中，同时对“常见问题”做规则直达，减少模型调用。预计今天晚上先上预发布验证，如果效果合格再推进到生产。

**优化思路**：缓存最近1000条请求的embedding；阈值相似度大于0.92直接复用结果。

*验证指标*：P50 < 700ms，P95 < 1.4s。

```text
cache_ttl: 10m
hit_rate_target: 45%
```

如有更好的优化方向请随时补充，尤其是关于Embedding缓存命中策略的经验。'
FROM channels c WHERE c.name = '项目更新' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '张栩', 'ZX', '## 监控与告警优化提案
目前告警噪音很高，夜间值班经常被重复告警打断。建议按服务级别重新梳理指标，区分用户可感知问题与内部波动，减少无效告警。

**目标**：降低误报率，确保关键告警在5分钟内响应。

*建议*：引入告警合并与抑制规则，并增加故障演练。

```json
{"metric":"latency_p95","threshold":900,"window":"5m"}
```

欢迎补充你们最常被误报的场景，我会整理成清单。'
FROM channels c WHERE c.name = '技术讨论' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '梁灿', 'LC', '## API版本策略讨论
最近外部合作方增加，我们需要明确API版本策略。目前部分接口通过参数兼容，但文档难以维护。我建议采用路径版本与废弃周期并行，给出明确的升级窗口。

**方案**：v1保持兼容六个月，v2引入新字段，老字段标注弃用。

*风险*：客户端升级节奏不一致，可能出现分裂。

```text
/api/v1/...  ->  /api/v2/...
```

希望大家提供各自服务的版本管理经验。'
FROM channels c WHERE c.name = '技术讨论' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '任博', 'RB', '## 数据库迁移演练
准备做一次数据库迁移演练，目标是验证大表结构调整的风险与回滚流程。当前计划先在预发布演练，再到生产灰度。

**关注点**：锁表时长、写入延迟、回滚路径是否可用。

*建议*：提前建影子表并双写，对比一致性。

```sql
alter table messages add column tags text[];
```

请大家评估是否会影响你们的查询与索引策略。'
FROM channels c WHERE c.name = '技术讨论' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '蔡雨', 'CY', '## 新手引导流程优化
新用户首次进入频道时缺少引导，导致误以为需要手动选频道。建议在首页增加三步引导，包含自动分类说明与推荐频道示例。

**目标**：降低首次发帖的阻力，提高发布成功率。

*交互*：第一步介绍AI分类，第二步展示示例卡片，第三步引导发布。

```text
Step1 说明 -> Step2 示例 -> Step3 立即发布
```

大家看看文案是否需要更简洁，或增加跳过入口。'
FROM channels c WHERE c.name = '产品设计' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '袁澄', 'YC', '## 空状态视觉与文案
当频道无消息时，当前页面显得空洞。建议设计一个轻量插画和明确引导文案，提示用户去发布或查看推荐频道。

**文案方向**：强调自动分类，减少选择成本。

*候选*：立即发布问题、浏览推荐频道、查看最新公告。

```text
让AI帮你找到最合适的频道
```

如果有更贴近Teams语气的文案，欢迎补充。'
FROM channels c WHERE c.name = '产品设计' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '顾薇', 'GW', '## 卡片层级与密度建议
当前卡片信息密度偏高，建议标题与摘要之间增加间距，并增加淡色分割线。预览卡片的顶部图标可以用更小尺寸，避免喧宾夺主。

**排版**：标题16px，摘要13px，作者信息12px。

*细节*：hover时提升阴影但不要改变布局。

```css
gap: 6px;
```

这部分我可以提供Figma样式表。'
FROM channels c WHERE c.name = '产品设计' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '谢霖', 'XL', '## 时区显示错误
消息列表时间显示与本地时区不一致，尤其是跨时区测试时，出现提前或延后8小时的情况。初步判断是前端使用了固定时区格式化。

**复现**：将系统时区切换为UTC，刷新页面，时间显示不一致。

*建议*：统一使用本地时区格式化，并明确展示日期。

```ts
new Date(ts).toLocaleString()
```

请确认服务端是否返回了UTC或本地时间。'
FROM channels c WHERE c.name = 'Bug反馈' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '方泽', 'FZ', '## 文件上传失败
上传附件超过5MB时会直接失败，没有提示错误原因。控制台显示413，但页面没有任何反馈，用户容易误以为卡住。

**建议**：在上传前提示大小限制，失败时展示明确提示。

*可选*：支持分片上传或压缩提示。

```text
最大上传: 5MB
```

我可以补充复现视频与日志。'
FROM channels c WHERE c.name = 'Bug反馈' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '罗晴', 'LQ', '## 通知未到达
在关闭浏览器后未收到任何通知，重新打开才看到未读消息。推测是通知权限或订阅未初始化。

**复现步骤**：首次进入系统不授权通知，关闭页面后再授权，之后通知不触发。

*建议*：授权后立即重新订阅，并提示刷新。

```js
await registration.pushManager.subscribe()
```

请确认是否需要兼容Safari。'
FROM channels c WHERE c.name = 'Bug反馈' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '潘倩', 'PQ', '## API规范文档补充
我整理了API命名与错误码的规范补充，包含资源命名、分页格式、错误码分级与示例响应。请在评审前先看一遍，尤其是旧接口的兼容策略。

**重点**：错误码统一为四位，前两位为模块编号。

*示例*：

```json
{"code":1201,"message":"invalid_param"}
```

欢迎补充你们在对接时遇到的问题。'
FROM channels c WHERE c.name = '文档分享' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '邱铭', 'QM', '## 事故处理Runbook
整理了事故处理Runbook，包括故障分级、沟通模板、回滚流程与复盘清单。建议每次发布前过一遍关键指标和回滚开关。

**流程**：确认影响范围 -> 降级 -> 回滚 -> 复盘。

*模板*：沟通口径已放在文档首页。

```text
P0: 全站不可用
```

后续我会把模板做成可复用表单。'
FROM channels c WHERE c.name = '文档分享' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '沈川', 'SC', '## 新人上手清单
新人入职时经常不知道先看哪份文档，我整理了一份上手清单：开发环境配置、数据库初始化、常用脚本、以及部署注意事项。建议把这份清单放到首页固定位置。

**建议**：每月更新一次，避免过期。

*目录*：环境配置 -> 数据初始化 -> 调试工具。

```text
1. git clone
2. pnpm install
3. pnpm dev
```

如有缺项请直接留言。'
FROM channels c WHERE c.name = '文档分享' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '季瑶', 'JY', '## 健身打卡提案
最近大家久坐比较多，提议做一个两周的步数打卡活动，每天1万步，失败请喝咖啡。可以在频道里每天贴步数截图。

**奖励**：连续达标送小礼物。

*规则*：允许请假一次，但要提前说明。

```text
活动周期: 2周
```

想参加的请回复表情。'
FROM channels c WHERE c.name = '生活日常' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '孟菲', 'MF', '## 办公室零食清单
大家可以在这里补充想要的零食，我会整理后统一采购。优先考虑健康一点的，比如坚果、酸奶和低糖饼干。

**规则**：每人最多提3样，控制预算。

*候选*：坚果、茶包、燕麦棒、黑巧。

```text
预算上限: 500
```

欢迎留言你们的最爱。'
FROM channels c WHERE c.name = '生活日常' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '谭朵', 'TD', '## 周末徒步计划
周末计划去郊外徒步，路线难度中等，大概3小时。需要自带水和简单补给，集合时间早上9点。

**注意**：带好防晒和雨具，尽量穿防滑鞋。

*线路*：起点地铁站 -> 山脚 -> 观景台。

```text
预计人数: 8
```

想参加的请私信我确认。'
FROM channels c WHERE c.name = '生活日常' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '杜岩', 'DY', '## 本周迭代进度
本周迭代主要完成了预览卡片样式、搜索栏UI和发帖入口调整。剩余工作是移动端适配与性能优化，预计两天内完成。

**进度**：前端80%，后端70%，设计已验收。

*阻塞*：移动端滚动抖动需要定位。

```text
ETA: 周四
```

如有依赖请在今天内提出。'
FROM channels c WHERE c.name = '项目更新' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '方禹', 'FY', '## 风险清单更新
更新了风险清单：模型响应慢、预览卡片性能、移动端兼容、以及搜索栏可用性。已为每个风险标注负责人和缓解措施。

**下步**：周三评审风险缓解进展。

*建议*：增加灰度观察窗口，不要一次性全量。

```text
risk_score: medium
```

请大家确认自己的负责人项是否正确。'
FROM channels c WHERE c.name = '项目更新' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content)
SELECT c.id, '许宁', 'XN', '## 依赖项对齐
当前依赖项包括埋点SDK升级、日志平台权限申请和AI模型配额调整。若其中任一项延迟，会影响灰度计划。

**需求**：希望本周内完成SDK升级，日志平台权限下周一到位。

*建议*：先在预发布验证埋点，再同步到生产。

```text
deps: sdk, logs, quota
```

如有阻塞请及时反馈。'
FROM channels c WHERE c.name = '项目更新' LIMIT 1;
