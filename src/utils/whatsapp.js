const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918940448177';

const sanitizePhoneNumber = (phoneNumber = DEFAULT_WHATSAPP_NUMBER) =>
  String(phoneNumber).replace(/\D/g, '');

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const buildWhatsAppLink = (message, phoneNumber = DEFAULT_WHATSAPP_NUMBER) =>
  `https://wa.me/${sanitizePhoneNumber(phoneNumber)}?text=${encodeURIComponent(message)}`;

export const buildProductWhatsappMessage = ({
  productName,
  sku,
  price,
  size,
  quantity
}) => `Hello Sri Bairavi Chemicals,

I am interested in:

Product: ${productName || 'Product enquiry'}
SKU: ${sku || 'N/A'}
Price: ${formatCurrency(price)}
Size: ${size || 'Standard'}
Quantity: ${quantity || 1}

Please share:
- Availability
- Bulk price
- Delivery details
- Quotation

Thank you.`;

export const buildProductWhatsappLink = (productDetails, phoneNumber = DEFAULT_WHATSAPP_NUMBER) =>
  buildWhatsAppLink(buildProductWhatsappMessage(productDetails), phoneNumber);

export const buildCartWhatsappMessage = ({
  items = [],
  gstAmount,
  shippingAmount,
  totalAmount
}) => {
  const lineItems = items.map((item, index) => {
    const details = [
      `${index + 1}. ${item.productName || 'Product'}${item.quantity ? ` - Qty ${item.quantity}` : ''}`,
      item.size ? `Size: ${item.size}` : null,
      item.sku ? `SKU: ${item.sku}` : null,
      item.price ? `Price: ${formatCurrency(item.price)}` : null
    ].filter(Boolean);

    return details.join('\n');
  }).join('\n\n');

  const totals = [
    typeof gstAmount === 'number' ? `GST: ${formatCurrency(gstAmount)}` : null,
    typeof shippingAmount === 'number'
      ? `Shipping: ${shippingAmount === 0 ? 'FREE' : formatCurrency(shippingAmount)}`
      : null,
    typeof totalAmount === 'number' ? `Estimated Total: ${formatCurrency(totalAmount)}` : null
  ].filter(Boolean);

  return `Hello Sri Bairavi Chemicals,

I need quotation for:

${lineItems}

${totals.length ? `${totals.join('\n')}\n\n` : ''}Please share:
- Availability
- Bulk price
- Delivery details
- Total quotation

Thank you.`;
};

export const buildCartWhatsappLink = (cartDetails, phoneNumber = DEFAULT_WHATSAPP_NUMBER) =>
  buildWhatsAppLink(buildCartWhatsappMessage(cartDetails), phoneNumber);

export const openWhatsappLink = (whatsappLink) => {
  if (typeof window !== 'undefined') {
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  }
};
