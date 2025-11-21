export const renderLicensePlate = (licensePlate?: string) => {
    if (!licensePlate) return null;
    // Replace every occurrence of 'H' with 'هـ'
    const modifiedPlate = licensePlate
      .split('')
      .map((char) => (char === 'H' ? 'هـ' : char));
    return (
      <div className="flex space-x-1">
        {modifiedPlate.map((char, index) => (
          <span key={index} className="license-character">
            {char}
          </span>
        ))}
      </div>
    );
  };