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
    brandingDiv.style.borderRadius = '10px';
    brandingDiv.style.maxHeight = 'fit-content';
    brandingDiv.style.alignItems = 'center';


    var imagesDiv = document.createElement('div');
    imagesDiv.style.width = '161px';
    imagesDiv.style.display = 'flex';
    imagesDiv.style.justifyContent = 'space-between';

    var image1 = document.createElement('img');
    image1.src = 'https://762d0145e332a78fcb6f9b9f529c26ab.cdn.bubble.io/f1687223907166x372570148873097660/Powered_by_text.svg';
    image1.style.width = '65.19px';
    image1.style.height = 'auto';
    image1.style.marginTop = '1.48px';
    image1.style.marginBottom = '0.23px';

    var image2 = document.createElement('img');
    image2.src = 'https://762d0145e332a78fcb6f9b9f529c26ab.cdn.bubble.io/f1687228487060x445089023249106500/wspoweredbylogo.png';
image2.alt = 'White Swan Partner Logo';
    image2.style.width = '89px';
    image2.style.height = 'auto';
image2.style.marginTop = '-4px';
    image2.style.marginBottom = '0.6px';

    var link = document.createElement('a');
    link.href = 'https://whiteswan.io';
    link.target = '_blank';
    link.appendChild(image2);

    imagesDiv.appendChild(image1);
    imagesDiv.appendChild(link);

    brandingDiv.appendChild(imagesDiv);
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
