import React from 'react';

interface AnimatedGlowingBorderProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedGlowingBorder: React.FC<AnimatedGlowingBorderProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center group w-full h-full ${className}`}>
      {/* Blurred rotating backgrounds layer 1 */}
      <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px] 
                      before:absolute before:content-[''] before:z-[-2] before:w-[200%] before:h-[200%] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[60deg]
                      before:bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)] before:transition-all before:duration-2000
                      group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]">
      </div>
      
      {/* Blurred rotating backgrounds layer 2 */}
      <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px] 
                      before:absolute before:content-[''] before:z-[-2] before:w-[200%] before:h-[200%] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                      before:bg-[conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b60,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                      group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
      </div>

      {/* Blurred rotating backgrounds layer 3 */}
      <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[2px] 
                      before:absolute before:content-[''] before:z-[-2] before:w-[200%] before:h-[200%] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                      before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#a099d8,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#dfa2da,rgba(0,0,0,0)_58%)] before:brightness-[1.4]
                      before:transition-all before:duration-2000 group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]">
      </div>

      {/* Blurred rotating backgrounds layer 4 */}
      <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[0.5px] 
                      before:absolute before:content-[''] before:z-[-2] before:w-[200%] before:h-[200%] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[70deg]
                      before:bg-[conic-gradient(#1c191c,#402fb5_5%,#1c191c_14%,#1c191c_50%,#cf30aa_60%,#1c191c_64%)] before:brightness-[1.3]
                      before:transition-all before:duration-2000 group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]">
      </div>

      <div className="relative w-full h-full p-[2px] z-10">
         <div className="w-full h-full bg-[#010201] rounded-xl overflow-hidden relative group-hover:bg-[#010201]/90 transition-colors">
            {/* The pink mask flair inside the border */}
            <div className="pointer-events-none w-[30%] h-[20px] absolute bg-[#cf30aa] top-[10px] left-[5px] blur-2xl opacity-40 transition-all duration-2000 group-hover:opacity-0 z-0"></div>
            
            {/* The actual content (e.g. GlassSurface) */}
            <div className="relative w-full h-full z-10">
              {children}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnimatedGlowingBorder;
