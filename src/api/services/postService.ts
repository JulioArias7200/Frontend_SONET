import apiClient from "@/api/apiClient";

const postService = {
  getAllPosts: async () => {
    try {
      const response = await apiClient.get("/api/posts");
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message, error };
    }
  }
};

export default postService;