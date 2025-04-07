import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';
import { LogActions } from '../actions/actions.entity';

@Schema({ timestamps: true }) //'{timestamp: true}' adds two properties of the type Date, createdAt & updatedAt
export class Log extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId; // Nullable (for anonymous actions)

  @Prop({
    type: String,
    required: true,
    enum: Object.values(LogActions), // Explicit enum values
    message: `Action must be one of: ${Object.values(LogActions).join(', ')}`,
  })
  action: string;

  @Prop({ type: Object })
  metadata?: {
    productId?: string; // Explicit typing for common fields
    searchQuery?: string;
    [key: string]: any; // Flexible for other properties
  };
}

export const LogSchema = SchemaFactory.createForClass(Log);

// Explanation of HydratedDocument:
// This provides TypeScript type for documents returned from Mongoose queries,
// including instance methods and virtuals.
export type LogDocument = HydratedDocument<Log>;
