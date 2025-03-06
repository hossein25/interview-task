import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/_number";
import { Order } from "@/lib/types";
import { FunctionComponent } from "react";

type OrdersTableProps = {
  orders: Order[];
};

const OrdersTable: FunctionComponent<OrdersTableProps> = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Remain</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell>{formatNumber(order.remain)}</TableCell>
            <TableCell>{formatNumber(order.price)}</TableCell>
            <TableCell>{formatNumber(order.value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
