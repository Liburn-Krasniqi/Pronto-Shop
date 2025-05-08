import { MessageConfig } from ".";

//Column config allows us to have display names that are different from the actual Entity atribute names e.g. "StockQuanity" can be mapped to "Stock Quantity", thats why we have the key and the displayName, hope this makes sense
export interface ColumnConfig {
  key: string;
  displayName: string;
}

// export interface PaginationConfig {
//   perPage: number;
//   page: number;
//   total: number;
// }

export interface CustomTableProps {
  // For display purposes as aforementioned. Peep the fact that it is an array.
  columns: ColumnConfig[];
  // Key of type: string, and values of type: any. Since this is a dynamic table. Peep the fact that it is also an array.
  data: Record<string, any>[];
  // This is needed for the loading spinner :)
  loading: boolean;
  // Lets say this is a table about Products, its gonna display '+ Add new product' on the create button
  entityName?: string;
  // Lets say this is a table about a specific vendors products, we can pass that info in dynamically
  title: string;
  // add error prop (or call it message prop so we can display any type of message here?)
  messages?: MessageConfig[];
  // add pagination prop (LLMs recomeded cause i dont know how to do that)
  // pagination?: any;
  // onDelete and onEdit function that requires an id of either type: number or type: string (because we use autoincrement id's: int and uuid's: string) return is void but could be something else for error catching purposes?
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
  //onCreate to handle what happens when create button is clicked
  onCreate: () => void;
  onCloseMessage?: (index: number) => void;
}
