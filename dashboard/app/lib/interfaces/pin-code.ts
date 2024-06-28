export type TWithPinCode<T> = {
  onTogglePinCodeModal: () => void;
} & T;

export type PinCodeWrapperProps<K> = {
  onConfirmPinCodeSuccess: () => void;
} & K;
