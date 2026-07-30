/**
 * Standard return of every write Server Action. Actions never throw to the
 * client — they return this and the component decides what to show, keeping
 * failure handling in the layer that knows the UI.
 */
export interface FormState {
  success: boolean;
  message: string;
  errors: Record<string, string[]> | null;
}
