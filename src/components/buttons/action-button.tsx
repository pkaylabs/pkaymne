import { FC } from 'react';
import {
  EyeIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  CalculatorIcon,
  ArrowsPointingOutIcon,
  PaperAirplaneIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathRoundedSquareIcon,
  MagnifyingGlassPlusIcon,
  ArrowTopRightOnSquareIcon,
  Cog8ToothIcon,
  TrashIcon,
  ReceiptPercentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { classNames, wrapClick } from '@/utils';
import 'react-tooltip/dist/react-tooltip.css';

const Actions = [
  'update',
  'view',
  'configure',
  'calculate',
  'assign',
  'schedule',
  'send',
  'resolve',
  'approve',
  'reject',
  'reassign',
  'expand',
  'goto',
  'clone',
  'investigate',
  'remove',
  'close',
  'assignPercentage',
] as const;
export type Action = (typeof Actions)[number];
const ActionIcons: { [key in Action]: typeof EyeIcon } = {
  approve: ClipboardDocumentCheckIcon,
  assign: UserPlusIcon,
  calculate: CalculatorIcon,
  configure: Cog8ToothIcon,
  reassign: UserIcon,
  reject: ArrowPathRoundedSquareIcon,
  resolve: ClipboardDocumentListIcon,
  schedule: CalendarDaysIcon,
  send: PaperAirplaneIcon,
  update: PencilSquareIcon,
  view: EyeIcon,
  expand: ArrowsPointingOutIcon,
  goto: ArrowTopRightOnSquareIcon,
  clone: DocumentDuplicateIcon,
  investigate: MagnifyingGlassPlusIcon,
  remove: TrashIcon,
  assignPercentage: ReceiptPercentIcon,
  close: XMarkIcon,
};

interface ActionButtonProps {
  action: Action;
  onClick: (...val: any) => any;
  disabled?: boolean;
  tooltip?: string;
}

const ActionButton: FC<ActionButtonProps> = ({ action, onClick, tooltip, disabled = false }) => {
  const Icon = ActionIcons[action];

  return (
    <button
      data-tooltip-delay-show={1000}
      data-tooltip-id='global-tooltip'
      data-tooltip-content={tooltip || action}
      type='button'
      onClick={wrapClick(onClick)}
      disabled={disabled}
      className={classNames(
        disabled
          ? 'cursor-not-allowed text-gray-500 hover:bg-gray-300'
          : 'text-gray-500 hover:bg-gray-300 hover:text-gray-900',
        'inline-flex items-center rounded-full border border-transparent p-1  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      )}>
      <Icon className='h-5 w-5' aria-hidden='true' />
    </button>
  );
};
export default ActionButton;
