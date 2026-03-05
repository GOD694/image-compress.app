import React, { useState } from 'react'

const App = () => {
  const [image, setImage] = useState(null);// image ko lene or set karne ke liye 
  const [visibleImg, setVisibleImg] = useState(null);
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.3);
  const [OrignalSize, setOrignalSize] = useState(0);
  const [compressedSize, setcompressedSize] = useState(0);


  // jab koi image upload ya change  karega to handleImageChange function call hoga
  const handleImageChange = (e) => {

    const file = e.target.files[0]; // file ko get karna 
    if (file) {  // agar file exist karti hai to
      const reader = new FileReader(); // file reader buuiltin function hai 
      reader.onloadend = () => { // jab file read ho jaye to ye function call hoga 
        setImage(URL.createObjectURL(file)); // image state ko update karna 
        // setVisibleImg(file); // visibleImg state ko update karna
        setOrignalSize((file.size / 1024).toFixed(2)); // orignal size ko kb me convert karna or  2 dec val
      };
      reader.readAsDataURL(file); // file ko data URL me read karna

    }

  };
  //  logic for compressing and converting image
  const compressAndConvertImage = () => {
    if (!image) return; // agar visibleImg exist nahi karti to return kar do
    const img = new Image(); // new image object create karna  same hai img = document.createElement('img');
    img.src = image; // image ka source set karna (object URL from state)
    img.onload = () => { // jab image load ho jaye to ye function call hoga 
      const canvas = document.createElement('canvas'); // canvas element create karna
      const ctx = canvas.getContext('2d'); // canvas ka context get karna
      canvas.width = img.width; // canvas ki width set karna
      canvas.height = img.height; // canvas ki height set karna
      ctx.drawImage(img, 0, 0); // image ko canvas par draw karna
      const qualityNumber = typeof quality === 'string' ? parseFloat(quality) : quality; // ensure number 0-1
      canvas.toBlob( // canvas ko blob me convert karna
        (blob) => {
          if (!blob) return;
          const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
          const ext = extMap[format] || 'jpg';
          const compressedFile = new File([blob], `compressed_image.${ext}`, { type: format }); // compressed file create karna
          setVisibleImg(URL.createObjectURL(compressedFile)); // image state ko update karna
          setcompressedSize((compressedFile.size / 1024).toFixed(2)); // size kb me convert karna 
        },
        format,
        qualityNumber
      );
    };
  };

  const imgDownload = () =>{
    if (!visibleImg) return;
    const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    const ext = extMap[format] || 'jpg';
    const link = document.createElement('a');
    link.href = visibleImg;
    link.download = `compressed_image.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <div className='min-h-screen bg-[#9d9d9d] flex  justify-center items-center p-6'>
        <div className='bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl'>
          <h1 className='text-2xl font-bold mb-4'>Image Compressor & Converter</h1>
          <label className='flex justify-center items-center h-32 border-dashed bg-[#e4ddde]  rounded border-2 border-blue-700 hover:border-black cursor-pointer' >
            <span className='font-semibold'>Drag and Drop or Click to Upload image</span>
            <input type="file" accept='image/*' onChange={handleImageChange} className='hidden' />
          </label>
          {image && (
            <div className='text-center mt-6'>
              <h1 className='text-2xl font-bold mb-2'>Preview</h1>
              <img src={image} alt="Uploded Image" className="mx-auto h-48 w-48 object-cover bg-amber-400" />
              <p className='mt-2 text-sm text-[#535252]'>Orignal Size : {OrignalSize}kb </p>
            </div>
          )}
          {image && (
            <div className='mt-6 '>
              <div className='w-full max-w-xl'>
                <label >
                  <input type="range"
                    className='w-full h-3 accent-red-700 rounded-lg '
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => {
                      setQuality(e.target.value)
                    }} />
                </label>
              </div>
              <div className='flex justify-between items-center mt-4 b'>
                <select className=' px-4 py-2 border rounded font-bold text-blue-900' value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                </select>
                <button className='px-2.5 py-2.5 rounded-xl  bg-sky-600' onClick={compressAndConvertImage}>Click for Compressed</button>
              </div>


            </div>
          )}
          {visibleImg && (
            <div className='text-center mt-6'>
              <h1 className='text-2xl font-bold mb-2'>Compressed Image Below :</h1>
              <img src={visibleImg} alt="Uploded Image" className="mx-auto h-48 w-48 object-cover bg-amber-400" />
              <p className='mt-2 text-sm text-[#535252]'>Orignal Size : {compressedSize}kb </p>
            </div>
          )}
          {visibleImg && (
            <div className='flex justify-center items-center mt-4 b w-full '>
              <button className='px-2.5 py-2.5 rounded-xl  bg-sky-600 ' onClick={imgDownload}> Download Image </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
