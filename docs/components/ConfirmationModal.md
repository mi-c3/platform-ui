# ConfirmationModal

A confirmation dialog with a decline and a confirm button, built on the MUI [Dialog](https://mui.com/material-ui/api/dialog/) (with a dark styled paper) and the platform-ui `Button` component.

## Import

```js
import { ConfirmationModal } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| open | bool | - | Whether the dialog is shown. |
| header | string | - | Dialog title text. |
| message | string | - | Dialog body content. |
| onConfirm | func | - | Called when the confirm button is clicked. Receives `draftEvent` if provided, otherwise the click event. If omitted, the confirm button calls `onClose` instead. |
| onClose | func | - | Called when the dialog is dismissed (backdrop, decline button, and — unless `noCloseOnConfirm` — before `onConfirm`). |
| confirmButtonText | string | - | Label of the confirm button. |
| declineButtonText | string | - | Label of the decline button. |
| confirmButtonDisabled | bool | - | Disables the confirm button. |
| noDecline | bool | - | If `true`, the decline button is not rendered. |
| noCloseOnConfirm | bool | - | If `true`, confirming does not call `onClose`; you must close the dialog yourself. |
| draftEvent | object | - | Arbitrary payload passed to `onConfirm` instead of the click event. |
| declineButtonProps | object | - | Extra props spread onto the decline `Button`. |
| confirmationButtonProps | object | - | Extra props spread onto the confirm `Button`. |
| maxWidth | string \| bool | - | Forwarded to MUI `Dialog` (`'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false`). |
| fullWidth | bool | - | Forwarded to MUI `Dialog`. |

All props are destructured explicitly; there is no generic pass-through to the underlying `Dialog`.

## Usage

```jsx
<ConfirmationModal
    open={showConfirm}
    header="Confirmation"
    message="Are you sure you want to delete this attachment?"
    confirmButtonText="Yes"
    declineButtonText="No"
    onConfirm={handleDelete}
    onClose={() => setShowConfirm(false)}
/>
```

## Notes

- On confirm, `onClose` is invoked first (unless `noCloseOnConfirm`), then `onConfirm(draftEvent || event)`.
- Note the asymmetric prop names: `declineButtonProps` but `confirmationButtonProps`.
