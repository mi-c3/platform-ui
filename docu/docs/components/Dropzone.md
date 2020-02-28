---
id: dropzone
title: Dropzone
---

## Notes

Using `ReactDropzone` from [react-dropzone@9.0.0](https://github.com/react-dropzone/react-dropzone)

## Props

Name              |  Type  | Default                       | Description
----------------- | :----: | ----------------------------- | ------------------------------------------------------------------------------------------
accept            | string | image/_,video/_,application/* | Set accepted file types. See <https://github.com/okonet/attr-accept> for more information.
filesLimit        | number | 1                             | files limit
dropzoneTextHover | string | 'Drop files here...'          | text for on hover
dropzoneText      | string | 'Drag an image here'          | text for drop zone
showPreviews      |  bool  | false                         | show previews
showAlerts        |  bool  | false                         | show alerts
disableDragActive |  bool  | false                         | if true disabled hover styles effects on dragzone

## How to use

```javascript
import { Dropzone } from '@mic3/platform-ui';

// Wrapper for disabling onClick method inside dropzone for just accept just dragging files
const DropzoneWrapper = ({ children, ...restProps }: Object) => {
    const disablePropagation = useCallback((event) => {
        event.stopPropagation();
    }, []);
    return (
        <Dropzone
            accept="image/*,video/*,application/*,video/*,audio/*,text/*"
            {...restProps}
        >
            <WrapperContent onClick={disablePropagation}>
                {children}
            </WrapperContent>
        </Dropzone>
    );
};

<DropzoneWrapper onDropRejected={onDropRejected} onDropAccepted={onDropAccepted}>
    <Typography variant="h1">Drag some file inside this text area.</Typography>
</DropzoneWrapper>
```

## Storybook

<[Dropzone](/platform-ui/redirect?/storybook/index.html?path=/story/components-uploaders--dropzone)>
