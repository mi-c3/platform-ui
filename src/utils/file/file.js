
export const isImageType = (type) => type && type.startsWith('image/');


export const simplifySize = (filesize) => {
    var size = '';
    if(filesize >= 1000000){
        size = (filesize / 1000000) + ' megabytes';
    }else if(filesize >= 1000){
        size = (filesize / 1000) + ' kilobytes';
    }else{
        size = filesize + ' bytes';
    }
    return size;
};

const scalePreserveAspectRatio = (imgW, imgH, maxW, maxH) => Math.min((maxW/imgW),(maxH/imgH));

export const resizeImage = async ({ image, width, height, mime = 'image/jpg', quality = 0.8 }) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image;
    img.onload = () => {
        canvas.width = width;
        canvas.height = height;

        const w=img.width;
        const h=img.height;

        const sizer = scalePreserveAspectRatio(w, h, width, height);
        ctx.drawImage(img, 0, 0, w, h, 0, 0, w*sizer, h*sizer);
    };
    img.src = URL.createObjectURL(image);
    return new Promise(resolve => {
        canvas.toBlob(resolve, mime, quality);
    });
};
