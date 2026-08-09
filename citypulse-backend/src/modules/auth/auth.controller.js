import { authService } from "./auth.service.js";
import { sendSuccess } from "../../shared/utils/apiResponse.js";

export const authController = {
  async register(req, res) {
    const { user, token } = await authService.register(req.body);
    sendSuccess(res, {
      statusCode: 201,
      message: "Account created successfully",
      data: { user, token },
    });
  },

  async login(req, res) {
    const { user, token } = await authService.login(req.body);
    sendSuccess(res, {
      message: "Logged in successfully",
      data: { user, token },
    });
  },

  async me(req, res) {
    const user = await authService.getProfile(req.user.id);
    sendSuccess(res, { message: "Profile fetched", data: { user } });
  },
};
