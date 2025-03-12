import { forwardRef } from "react"
import type { Order } from "@/contexts/order-context"

interface PrintReceiptProps {
  order: Order | null
}

export const PrintReceipt = forwardRef<HTMLDivElement, PrintReceiptProps>(({ order }, ref) => {
  if (!order) return null

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div ref={ref} className="print-receipt bg-white p-6 max-w-md mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
          }
          .print-receipt {
            width: 80mm;
            padding: 10mm;
            margin: 0 auto;
            background-color: white;
            color: black;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 15px;
          }
          .receipt-header h1 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          .receipt-header p {
            margin: 2px 0;
            font-size: 12px;
          }
          .receipt-info {
            margin-bottom: 15px;
            border-bottom: 1px dashed #ccc;
            padding-bottom: 10px;
          }
          .receipt-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .receipt-items {
            border-bottom: 1px dashed #ccc;
            margin-bottom: 10px;
            padding-bottom: 10px;
          }
          .receipt-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .receipt-item-name {
            flex: 1;
          }
          .receipt-item-qty {
            width: 30px;
            text-align: center;
          }
          .receipt-item-price {
            width: 60px;
            text-align: right;
          }
          .receipt-totals {
            margin-bottom: 15px;
          }
          .receipt-total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .receipt-total-row.grand-total {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .receipt-footer {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
          }
          .receipt-footer p {
            margin: 3px 0;
          }
          .receipt-branding {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px dashed #ccc;
            text-align: center;
            font-size: 10px;
          }
        }
      `,
        }}
      />

      <div className="receipt-header">
        <h1>Wahab Kidney & General Hospital</h1>
        <p>Pharmacy POS System</p>
        <p>Timergara Dir Lower, KPK</p>
        <p>Tel: (0945) 824362</p>
      </div>

      <div className="receipt-info">
        <div className="receipt-info-row">
          <span>Order #:</span>
          <span>{order.id}</span>
        </div>
        <div className="receipt-info-row">
          <span>Date:</span>
          <span>{formatDate(order.date)}</span>
        </div>
        <div className="receipt-info-row">
          <span>Customer:</span>
          <span>{order.customer}</span>
        </div>
        <div className="receipt-info-row">
          <span>Payment:</span>
          <span>{order.paymentMethod}</span>
        </div>
      </div>

      <div className="receipt-items">
        <div className="receipt-item" style={{ fontWeight: "bold", marginBottom: "8px" }}>
          <div className="receipt-item-name">Item</div>
          <div className="receipt-item-qty">Qty</div>
          <div className="receipt-item-price">Price</div>
          <div className="receipt-item-price">Total</div>
        </div>

        {order.items.map((item) => (
          <div key={item.id} className="receipt-item">
            <div className="receipt-item-name">{item.name}</div>
            <div className="receipt-item-qty">{item.quantity}</div>
            <div className="receipt-item-price">Rs{item.price.toFixed(2)}</div>
            <div className="receipt-item-price">Rs{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="receipt-totals">
        <div className="receipt-total-row">
          <span>Subtotal:</span>
          <span>Rs{order.subtotal.toFixed(2)}</span>
        </div>
        <div className="receipt-total-row">
          <span>Tax ({order.taxRate}%):</span>
          <span>Rs{order.tax.toFixed(2)}</span>
        </div>
        <div className="receipt-total-row grand-total">
          <span>Total:</span>
          <span>Rs{order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="receipt-footer">
        <p>Thank you for your purchase!</p>
        <p>Please come again</p>
      </div>

      <div className="receipt-branding">
        <p>Powered by VN TEAM</p>
        <p>{new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
})

PrintReceipt.displayName = "PrintReceipt"

