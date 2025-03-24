import { Request, Response } from "express";
import { OrderController } from "../../controllers/order.controller";
import { OrderService } from "../../services/order.service";
import { CustomError } from "../../utils/error";

// Extend the Request type to include the user property
interface RequestWithUser extends Request {
  user?: {
    id: number;
    role?: string;
  };
}

// Mock the OrderService
jest.mock("../../services/order.service");

describe("OrderController", () => {
  let orderController: OrderController;
  let mockOrderService: jest.Mocked<OrderService>;
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup response spies
    jsonSpy = jest.fn().mockReturnThis();
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockResponse = {
      status: statusSpy,
      json: jsonSpy,
    };

    // Setup OrderService mock
    mockOrderService = new OrderService() as jest.Mocked<OrderService>;

    // Create controller with mocked service
    orderController = new OrderController();
    // Replace the real service with our mock
    (orderController as any).orderService = mockOrderService;
  });

  describe("createOrder", () => {
    it("should create an order successfully", async () => {
      // Arrange
      const mockItems = [{ productId: 1, quantity: 2 }];
      const mockOrder = {
        id: 1,
        userId: 123,
        items: mockItems,
        status: "pending",
      };

      mockRequest = {
        user: { id: 123 },
        body: { items: mockItems },
      };

      mockOrderService.createOrder = jest.fn().mockResolvedValue(mockOrder);

      // Act
      await orderController.createOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(123, mockItems);
      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(mockOrder);
    });

    it("should return 400 if items are missing", async () => {
      // Arrange
      mockRequest = {
        user: { id: 123 },
        body: {},
      };

      // Act
      await orderController.createOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.createOrder).not.toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: "Order must contain at least one item",
      });
    });

    it("should handle CustomError", async () => {
      // Arrange
      const mockItems = [{ productId: 1, quantity: 2 }];
      const mockError = new CustomError("Product not found", 404);

      mockRequest = {
        user: { id: 123 },
        body: { items: mockItems },
      };

      mockOrderService.createOrder = jest.fn().mockRejectedValue(mockError);

      // Act
      await orderController.createOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should handle generic errors", async () => {
      // Arrange
      const mockItems = [{ productId: 1, quantity: 2 }];

      mockRequest = {
        user: { id: 123 },
        body: { items: mockItems },
      };

      mockOrderService.createOrder = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act
      await orderController.createOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });

  describe("getOrderById", () => {
    it("should get order details successfully", async () => {
      // Arrange
      const mockOrderDetails = {
        id: 1,
        userId: 123,
        items: [],
        status: "pending",
      };

      mockRequest = {
        params: { id: "1" },
      };

      mockOrderService.getOrderById = jest
        .fn()
        .mockResolvedValue(mockOrderDetails);

      // Act
      await orderController.getOrderById(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.getOrderById).toHaveBeenCalledWith(1);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(mockOrderDetails);
    });
  });

  describe("getUserOrders", () => {
    it("should get user orders successfully", async () => {
      // Arrange
      const mockOrders = [{ id: 1, userId: 123, items: [], status: "pending" }];

      mockRequest = {
        user: { id: 123 },
      };

      mockOrderService.getUserOrders = jest.fn().mockResolvedValue(mockOrders);

      // Act
      await orderController.getUserOrders(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.getUserOrders).toHaveBeenCalledWith(123);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(mockOrders);
    });
  });

  describe("cancelOrder", () => {
    it("should cancel order successfully", async () => {
      // Arrange
      mockRequest = {
        params: { id: "1" },
        user: { id: 123 },
      };

      mockOrderService.cancelOrder = jest.fn().mockResolvedValue(true);

      // Act
      await orderController.cancelOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.cancelOrder).toHaveBeenCalledWith(1, 123);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("completeOrder", () => {
    it("should complete order successfully when user is seller", async () => {
      // Arrange
      mockRequest = {
        params: { id: "1" },
        user: { id: 123, role: "seller" },
      };

      mockOrderService.completeOrder = jest.fn().mockResolvedValue(true);

      // Act
      await orderController.completeOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.completeOrder).toHaveBeenCalledWith(1);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({ success: true });
    });

    it("should return 403 when user is not a seller", async () => {
      // Arrange
      mockRequest = {
        params: { id: "1" },
        user: { id: 123, role: "customer" },
      };

      // Act
      await orderController.completeOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.completeOrder).not.toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalledWith(403);
      expect(jsonSpy).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
  });

  describe("getPendingOrders", () => {
    it("should get pending orders when user is seller", async () => {
      // Arrange
      const mockOrders = [{ id: 1, userId: 123, items: [], status: "pending" }];

      mockRequest = {
        user: { id: 123, role: "seller" },
      };

      mockOrderService.getPendingOrders = jest
        .fn()
        .mockResolvedValue(mockOrders);

      // Act
      await orderController.getPendingOrders(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.getPendingOrders).toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(mockOrders);
    });

    it("should return 403 when user is not a seller", async () => {
      // Arrange
      mockRequest = {
        user: { id: 123, role: "customer" },
      };

      // Act
      await orderController.getPendingOrders(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockOrderService.getPendingOrders).not.toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalledWith(403);
      expect(jsonSpy).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
  });
});
