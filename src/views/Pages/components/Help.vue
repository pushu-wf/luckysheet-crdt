<template>
	<div>
		<a-modal v-model:open="helpModalVisible" title="📣 帮助" style="width: 60%" cancelText="取消" okText="确认">
			<div class="help-box">
				<div class="help-btns">
					<a-button style="margin-right: 10px">
						<a href="https://dream-num.github.io/LuckysheetDocs/zh/guide/" target="_blank">
							<ExportOutlined style="margin-right: 10px" />官方文档
						</a>
					</a-button>
					<a-button style="margin-right: 10px">
						<a href="https://blog.csdn.net/weixin_47746452/category_12491584.html?spm=1001.2014.3001.5482" target="_blank">
							<ChromeOutlined style="margin-right: 10px" />相关博客
						</a>
					</a-button>
					<a-button style="margin-right: 10px">
						<a href="https://gitee.com/wfeng0/luckysheet-crdt/issues/new" target="_blank">
							<GithubOutlined style="margin-right: 10px" />ISSUES
						</a>
					</a-button>
					<a-button style="margin-right: 10px">
						<a
							href="https://www.bilibili.com/video/BV1TGk1YDEJj/?spm_id_from=333.1387.homepage.video_card.click&vd_source=604a25c77e296b4ce29b1e6e6cf03ea6"
							target="_blank">
							<YoutubeOutlined style="margin-right: 10px" /> Bilibili
						</a>
					</a-button>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ExportOutlined, GithubOutlined, YoutubeOutlined, ChromeOutlined } from "@ant-design/icons-vue";

const helpModalVisible = ref(false);

defineExpose({ open: () => (helpModalVisible.value = true) });
</script>
