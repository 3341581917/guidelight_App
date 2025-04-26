<template>
    <el-container class="container gesture-recognizer-container">
      
      <el-main class="video-container">
        <!-- 视频容器，使用v-if完全控制DOM中是否存在视频元素 -->
        <el-card class="video-card">
          <div v-if="isStreamActive" class="stream-container">
            <!-- 使用timestamp作为key强制重新渲染 -->
            <img 
              ref="videoElement" 
              :src="videoUrl" 
              :key="timestamp" 
              class="video-stream" 
              @error="handleImageError"
            />
          </div>
          <div v-else class="empty-stream">
            <span>摄像头已关闭</span>
          </div>
        </el-card>

      </el-main>
  
      <el-footer class="footer">
        <!-- 添加禁用状态防止重复点击 -->
        <el-button 
          type="primary" 
          @click="handleStartCamera" 
          :disabled="isLoading">
          {{ isLoading ? '处理中...' : '开启摄像头' }}
        </el-button>
        <el-button 
          type="danger" 
          @click="handleStopCamera" 
          :disabled="!isStreamActive || isLoading">
          停止摄像头
        </el-button>
        
        <!-- 紧急重置按钮 - 总是可点击 -->
        <el-button 
          type="warning" 
          @click="resetState" 
          style="margin-left: 10px;">
          重置状态
        </el-button>
      </el-footer>
    </el-container>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import axios from "axios";
  import {ElMessage} from 'element-plus';
//   import { useUserStore } from "../../store/userStore";
  // Flask 服务器地址（确保和 Flask 端口一致）
  const serverUrl = "http://127.0.0.1:5000";
  
  // 配置axios默认超时
  axios.defaults.timeout = 8000; // 8秒超时
  
  // 状态管理
  const isStreamActive = ref(false);
  const videoUrl = ref('');
  const videoElement = ref(null);
  const timestamp = ref(Date.now()); // 添加时间戳
  const isLoading = ref(false);

  // 处理图像加载错误
  const handleImageError = (e) => {
    console.error('图像加载失败:', e);
    // 如果图像加载失败，尝试重新加载或停止
    if (isStreamActive.value) {
      isStreamActive.value = false;
      videoUrl.value = '';
      ElMessage.error('视频流连接失败，请重试');
    }
  };

  // 开启摄像头处理函数
  const handleStartCamera = async () => {
    console.log("开启摄像头按钮被点击", Date.now());
    
    // 如果已经在加载中，防止重复点击
    if (isLoading.value) return;
    
    // 设置加载状态
    isLoading.value = true;
    
    // 无论如何先设置非活动状态，确保之前的连接被关闭
    isStreamActive.value = false;
    videoUrl.value = '';
    
    // 强制Vue重新渲染
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 设置超时计时器确保不会永久卡住
    const timeoutId = setTimeout(() => {
      if (isLoading.value) {
        isLoading.value = false;
        ElMessage.error("操作超时，请重试");
      }
    }, 10000); // 10秒超时
    
    try {
      // 先发送请求启动摄像头
      const response = await axios.post(`${serverUrl}/g_recognizer/start_cameras`);
      console.log("后端响应:", response.data);
      
      // 更新时间戳确保URL不会被缓存
      timestamp.value = Date.now();
      
      // 设置URL（在响应后设置，确保后端准备好）
      videoUrl.value = `${serverUrl}/g_recognizer/video_feed?t=${timestamp.value}`; 
      isStreamActive.value = true;
    } catch (error) {
      console.error("启动摄像头失败:", error);
      ElMessage.error("启动摄像头失败，请检查后端服务是否正常运行。");
    } finally {
      // 取消超时计时器
      clearTimeout(timeoutId);
      // 无论成功与否，都取消加载状态
      isLoading.value = false;
    }
  };

  // 停止摄像头处理函数
  const handleStopCamera = async () => {
    console.log("停止摄像头按钮被点击", Date.now());
    
    // 如果已经在加载中，防止重复点击
    if (isLoading.value) return;
    
    // 设置加载状态
    isLoading.value = true;
    
    // 设置超时计时器确保不会永久卡住
    const timeoutId = setTimeout(() => {
      if (isLoading.value) {
        isLoading.value = false;
        ElMessage.success("已断开连接");
        // 强制关闭摄像头状态
        isStreamActive.value = false;
        videoUrl.value = '';
      }
    }, 5000); // 5秒超时
    
    try {
      // 1. 先将标志设为false，移除视频元素
      isStreamActive.value = false;
      videoUrl.value = '';
      
      // 2. 发送请求停止摄像头
      const response = await axios.post(`${serverUrl}/g_recognizer/stop_cameras`);
      console.log("停止摄像头响应:", response.data);
      
      // 3. 断开任何可能的连接
      if (videoElement.value) {
        const img = videoElement.value;
        // 创建一个克隆并替换原始元素
        if (img.parentNode) {
          const clone = document.createElement('img');
          clone.className = img.className;
          img.parentNode.replaceChild(clone, img);
        }
      }
    } catch (error) {
      // console.error("停止摄像头失败:", error);
      ElMessage.success("已断开连接");
    } finally {
      // 取消超时计时器
      clearTimeout(timeoutId);
      // 无论成功与否，都取消加载状态
      isLoading.value = false;
    }
  };

  // 添加紧急重置按钮函数
  const resetState = () => {
    isLoading.value = false;
    isStreamActive.value = false;
    videoUrl.value = '';
    console.log("状态已重置");
  };

  // 将方法暴露到全局以便HTML按钮可以直接访问
  window.startCamera = handleStartCamera;
  window.stopCamera = handleStopCamera;
  window.resetState = resetState;

  // 组件挂载时
  onMounted(() => {
    console.log("组件已挂载");
    // 确保初始状态关闭
    isStreamActive.value = false;
    videoUrl.value = '';
  });

  // 组件卸载前确保关闭摄像头
  onBeforeUnmount(() => {
    // 重置所有状态
    isLoading.value = false;
    isStreamActive.value = false;
    videoUrl.value = '';
    
    console.log("组件卸载，清理资源");
    
    // 清理全局方法
    delete window.startCamera;
    delete window.stopCamera;
    delete window.resetState;
  });
  </script>
  
  <style scoped>
  /* 页面布局 */
  .container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* 头部 */
  .header {
    background-color: #409eff;
    color: white;
    text-align: center;
    font-size: 20px;
    padding: 10px;
  }
  
  /* 视频区域 */
  .video-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    padding-bottom: 40px; /* 增加底部内边距 */
  }
  
  /* 每个摄像头的卡片 */
  .video-card {
    width: 62%;
    text-align: center;
    margin-bottom: 30px; /* 增加底部外边距 */
  }
  
 
  
  /* 视频流样式 */
  .video-stream {
    width: 100%;
    height: calc(100% - 20px); /* 减去底部margin的高度 */
    border-radius: 8px;
    object-fit: cover; /* 保持纵横比并填充容器 */
    margin-bottom: 20px; /* 底部边距 */
  }
  
  /* 空视频状态 */
  .empty-stream {
    padding: 10px;
    padding-bottom: 30px; /* 增加底部内边距 */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 8px;
    color: #909399;
    font-size: 18px;
  }
  
  /* 底部 */
  .footer {
    text-align: center;
    padding: 10px;
    padding-top: 0; /* 减少顶部内边距 */
    background-color: #f5f5f5;
    margin-top: auto; /* 推到底部 */
  }
  
  /* 按钮样式 */
  .start-btn {
    background-color: #409eff;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .stop-btn {
    background-color: #f56c6c;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  
  <!-- 全局样式覆盖 - 不使用scoped -->
  <style>
  .gesture-recognizer-container .el-card__body {
    padding: 10px;
    padding-bottom: 30px; /* 增加底部内边距 */
    height: 100%;
    display: flex;
    /* align-items: flex-end; */
    justify-content: center;
  }

  /* 添加流容器的样式 */
  .stream-container {
    margin-bottom: 20px; /* 增加底部外边距 */
    width: 100%;
    height: 100%;
  }
  </style>
  
  