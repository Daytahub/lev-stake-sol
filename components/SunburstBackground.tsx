const SunburstBackground = ({ className }: { className?: string }) => {
  // const storedLeverage = mangoStore((s) => s.leverage);
  // rotate-bg-${storedLeverage}x

  return (
    <div className="fixed inset-0 flex w-[300%] -translate-x-1/3 items-center justify-center overflow-hidden">
      <svg
        className={`${className} rotate-bg-1x`}
        height="3000"
        width="3000"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1333.3333 1333.3333"
        fill="currentColor"
      >
        <path
          fillRule="nonzero"
          d="M5000 5000C3821.48 6178.51 2154.82 7845.18 0 10000h769.23C2561.88 7978.64 3972.14 6311.97 5000 5000m0 0c-862.23 1426.3-2016.07 3092.97-3461.54 5000h769.23C3418.54 8186.5 4315.98 6519.83 5000 5000m0 0c-495.84 1591.2-1136.87 3257.87-1923.08 5000h769.23C4314.96 8306.04 4699.57 6639.37 5000 5000m0 0c-100.63 1663.63-228.84 3330.29-384.62 5000h769.24C5228.84 8330.29 5100.63 6663.63 5000 5000m0 0c300.43 1639.37 685.04 3306.04 1153.85 5000h769.23C6136.87 8257.87 5495.84 6591.2 5000 5000m0 0c684.02 1519.83 1581.46 3186.5 2692.3 5000h769.24C7016.07 8092.97 5862.23 6426.3 5000 5000m0 0c1027.86 1311.97 2438.13 2978.64 4230.77 5000H10000C7845.18 7845.18 6178.52 6178.51 5000 5000m0 0c1311.97 1027.86 2978.64 2438.12 5000 4230.77v-769.23C8092.97 7016.07 6426.3 5862.23 5000 5000m0 0c1519.83 684.02 3186.5 1581.46 5000 2692.31v-769.23C8257.87 6136.87 6591.2 5495.84 5000 5000m0 0c1639.37 300.43 3306.04 685.04 5000 1153.85v-769.23C8330.29 5228.84 6663.62 5100.63 5000 5000m0 0c1663.62-100.63 3330.29-228.84 5000-384.62v-769.23C8306.04 4314.96 6639.37 4699.57 5000 5000m0 0c1591.2-495.84 3257.87-1136.87 5000-1923.08V2307.7C8186.5 3418.54 6519.83 4315.98 5000 5000m0 0c1426.3-862.23 3092.97-2016.07 5000-3461.54V769.23C7978.64 2561.87 6311.97 3972.14 5000 5000m0 0L10000 0h-769.23C7438.13 2021.36 6027.86 3688.03 5000 5000m0 0C5862.23 3573.7 7016.07 1907.03 8461.54 0H7692.3C6581.46 1813.5 5684.02 3480.17 5000 5000m0 0C5495.84 3408.8 6136.87 1742.13 6923.08 0h-769.23C5685.04 1693.96 5300.43 3360.63 5000 5000m0 0c100.63-1663.62 228.84-3330.29 384.62-5000h-769.24c155.78 1669.71 283.99 3336.38 384.62 5000m0 0C4699.57 3360.63 4314.96 1693.96 3846.15 0h-769.23C3863.13 1742.13 4504.16 3408.8 5000 5000m0 0C4315.98 3480.17 3418.54 1813.5 2307.69 0h-769.23C2983.93 1907.03 4137.77 3573.7 5000 5000m0 0C3972.14 3688.03 2561.88 2021.36 769.23 0H0l5000 5000m0 0C3688.03 3972.14 2021.36 2561.87 0 769.23v769.23C1907.03 2983.93 3573.7 4137.77 5000 5000m0 0C3480.17 4315.98 1813.5 3418.54 0 2307.7v769.22C1742.13 3863.13 3408.8 4504.16 5000 5000m0 0C3360.63 4699.57 1693.96 4314.96 0 3846.15v769.23c1669.71 155.78 3336.38 283.99 5000 384.62m0 0C3336.38 5100.63 1669.71 5228.84 0 5384.62v769.23C1693.96 5685.04 3360.63 5300.43 5000 5000m0 0C3408.8 5495.84 1742.13 6136.87 0 6923.08v769.23C1813.5 6581.46 3480.17 5684.02 5000 5000m0 0C3573.7 5862.23 1907.03 7016.07 0 8461.54v769.23C2021.36 7438.12 3688.03 6027.86 5000 5000"
          transform="matrix(.1333333 0 0 -.1333333 0 1333.3333)"
        />
      </svg>
    </div>
  )
}

export default SunburstBackground
