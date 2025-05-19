<!-- 隐私协议模态框 -->
<template>
	<a-modal
		v-model:open="open"
		:bodyStyle="{ height: 'calc(100vh - 100px)', overflow: 'hidden' }"
		@ok="handleAgree"
		@cancel="handleCancel"
		style="top: 20px"
		title=""
		width="60%"
		cancelText="取消"
		okText="同意">
		<div class="privacy-container">
			<img src="/privacy.svg" alt="" />
			<h2>Luckysheet-CRDT 隐私协议概要</h2>
			<h4>
				感谢您信任并使用 Lucky sheet
				衍生产品！我们深知保护用户隐私信息的重要性，及开源知识产权保护的价值，请在使用本应用前，认真阅读一下协议条款，以帮助您规避使用过程中免受侵权或违反知识产权的隐患。
			</h4>
		</div>
		<div class="privacy-list">
			<ul>
				<div class="title">1. 开源协议说明</div>
				<p>本项目基于 Apache License 2.0 协议发布。你可以自由地使用、复制和分发本软件，包括修改和衍生作品，但必须遵守以下条款：</p>

				<li>Lucky sheet源码使用 MIT 开源协议；</li>
				<li>在重新分发时保留原始许可证副本；</li>
				<li>对修改过的文件添加显著的更改声明；</li>
				<li>保留所有版权声明、专利声明、商标声明以及归属信息；</li>
				<li>若原作品包含 NOTICE 文件，则衍生作品中也应包含相应的归属信息。</li>

				<div class="title">2. 贡献者协议</div>
				<p>欢迎你为本项目做出贡献。在提交贡献前，请注意以下事项：</p>
				<li>所有贡献（包括代码、文档、测试等）均默认遵循 Apache License 2.0 协议；</li>
				<li>如果你希望以其他协议发布你的贡献，请在提交前明确声明；</li>
				<li>提交的 Pull Request 必须符合项目的代码规范，并通过审核；</li>
				<li>所有贡献者需遵守社区的行为准则，包括尊重他人、拒绝人身攻击、维护专业交流环境等。</li>

				<div class="title">3. 数据隐私与安全</div>
				<p>本项目不涉及用户敏感数据的处理。如果你在使用或扩展本项目过程中引入了用户数据功能，请确保：</p>
				<li>明确告知用户数据的用途；</li>
				<li>获取用户的同意；</li>
				<li>遵守相关的隐私保护法律法规（如 GDPR、CCPA 等）；</li>
				<li>采取适当的技术措施保护用户数据的安全性。</li>

				<div class="title">4. 第三方依赖项</div>
				<p>
					本项目依赖多个第三方库，这些库可能遵循不同的开源协议。请确保你在使用这些依赖项时也遵守其各自的许可条款。你可以在
					<code>package.json</code>
					或相关文档中查看详细的依赖列表及其许可证信息。
				</p>

				<div class="title">5. 商标与品牌使用</div>
				<p>
					未经明确授权，不得使用本项目的名称、标志或其他品牌元素进行商业推广或误导性宣传。你可以在合理范围内引用项目名称用于技术讨论或文档说明。
				</p>

				<div class="title">6. 免责声明</div>
				<p>
					本软件按“原样”提供，不提供任何形式的明示或暗示的担保，包括但不限于适销性、适用性和非侵权的担保。使用本软件的风险由你自己承担。
				</p>

				<div class="title">7. 责任限制</div>
				<p>
					在任何情况下，项目作者或贡献者不对因使用或无法使用本软件而产生的任何直接、间接、附带、特殊、惩戒性或后果性损害承担责任，除非另有书面约定。
				</p>
			</ul>
		</div>
	</a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);

const emit = defineEmits(["agree"]);

// 显示向外暴露打开方法
function show() {
	open.value = true;
}

// 取消事件
function handleCancel() {
	open.value = false;
	emit("agree", false);
}

/** 点击同意事件 */
function handleAgree() {
	open.value = false;
	emit("agree", true);
}

defineExpose({ show });
</script>

<style lang="less" scoped>
.privacy-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	img {
		width: 220px;
	}
	h2 {
		color: #55bb8a;
	}
	h4 {
		text-indent: 2rem;
	}
}

.privacy-list {
	height: calc(100% - 280px);
	overflow: hidden;
	overflow-y: auto;
	.title {
		font-weight: 700;
		margin: 10px 0;
	}
	li {
		text-indent: 2rem;
		position: relative;
		&::after {
			content: "";
			display: inline-block;
			width: 4px;
			height: 4px;
			border-radius: 50%;
			top: 50%;
			transform: translateY(-50%);
			background-color: #000;
			position: absolute;
			left: 10px;
		}
	}
}
</style>
