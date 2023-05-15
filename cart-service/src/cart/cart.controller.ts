import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderEntity, OrderService, OrderStatus } from '../order';
import { AppRequest, getUserIdFromRequest, successfulResponse } from '@shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(private cartService: CartService, private orderService: OrderService) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));

    return successfulResponse({ cart, total: calculateCartTotal(cart) });
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    const cart = await this.cartService.updateByUserId(getUserIdFromRequest(req), body);

    return successfulResponse({ cart, total: calculateCartTotal(cart) });
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return successfulResponse();
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: AppRequest,
    @Body() { payment, delivery, comments }: Pick<OrderEntity, 'payment' | 'delivery' | 'comments'>,
  ) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return successfulResponse({}, 'Cart is empty', statusCode);
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);

    const order = await this.orderService.create(
      {
        user_id: userId,
        cart_id: cartId,
        total,
        status: OrderStatus.PAID,
        payment,
        delivery,
        comments,
      },
      items,
    );

    await this.cartService.removeByUserId(userId);
    await this.cartService.setCartToOrdered(userId);

    return successfulResponse({ order });
  }
}
