window.addEventListener('load', function() {
    iFrameResize({log:true},'#WhiteSwanIframe');
});  

window.addEventListener('load', function() {
    var iframe = document.getElementById('WhiteSwanIframe');

    var brandingDiv = document.createElement('div');
    brandingDiv.style.position = 'fixed';
    brandingDiv.style.bottom = '30px';
    brandingDiv.style.zIndex = '999999';
    brandingDiv.style.border = '1px solid #201139';
    brandingDiv.style.display = 'flex';
    brandingDiv.style.flexDirection = 'column';
    brandingDiv.style.alignItems = 'center';
    brandingDiv.style.left = '50%';
    brandingDiv.style.transform = 'translateX(-50%)';
    brandingDiv.style.padding = '15px 15px 15px 15px'; 
    brandingDiv.style.backgroundColor = '#fff';
    brandingDiv.style.borderRadius = '10px'; // Rounded corners
    brandingDiv.style.maxHeight = 'fit-content'; // max-height equal to the content height

    var image = document.createElement('img');
    image.src = 'https://762d0145e332a78fcb6f9b9f529c26ab.cdn.bubble.io/f1686841360789x450370912178613060/Powered%20By.svg';
    image.style.width = '161px';
    image.style.height = 'auto';

    brandingDiv.appendChild(image);
    document.body.appendChild(brandingDiv);

window.onscroll = function() {
        var rect = iframe.getBoundingClientRect();
        var iframeBottomAbsolute = window.scrollY + rect.bottom; // Absolute bottom of the iframe
        if (window.scrollY > iframeBottomAbsolute - window.innerHeight) {
            brandingDiv.style.position = 'absolute';
            brandingDiv.style.bottom = '30px';
            brandingDiv.style.top = (iframeBottomAbsolute - brandingDiv.offsetHeight) + 'px';
        } else {
            brandingDiv.style.position = 'fixed';
            brandingDiv.style.bottom = '30px';
            brandingDiv.style.top = 'unset';
        }
    };
}); 
