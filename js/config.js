/**
 * BARBER HOUSE — config.js
 * Único ponto de configuração do negócio.
 * Para personalizar o projeto para outro cliente, edite apenas este arquivo.
 */

export const CONFIG = Object.freeze({
  /** Nome exibido nas mensagens. */
  businessName: "Barber House",

  /**
   * Número de WhatsApp no formato internacional, somente dígitos:
   * código do país (55) + DDD + número.
   * ATENÇÃO: número fictício (projeto demonstrativo). Troque pelo real do cliente.
   */
  whatsappNumber: "5511900000000",

  /** Mensagem pronta enviada ao clicar em qualquer botão "Agendar". */
  whatsappMessage:
    "Olá, Barber House! Gostaria de agendar um horário. Poderiam me informar os horários disponíveis?",
});
