import React from "react";

const ServiceSection = ({
  selectedService,
  quantity,
  description,
  onSelectService,
  onQuantityChange,
  onDescriptionChange,
  show,
  errors,
}) => {
  if (!show) return null;

  return (
    <div className="service-section">
      {/* Your service selection UI */}
      {/* Example: */}
      <button
        onClick={() =>
          onSelectService({
            /* service data */
          })
        }
      >
        Select Service
      </button>
      {selectedService && (
        <div>
          <input
            style={{ marginLeft: "10px" }}
            type="number"
            value={quantity}
            onChange={onQuantityChange}
            max={999}
          />
          <textarea
            value={description}
            onChange={onDescriptionChange}
            placeholder="Description"
          />
          {errors.min && <p className="error">{errors.min}</p>}
          {errors.max && <p className="error">{errors.max}</p>}
        </div>
      )}
    </div>
  );
};

export default ServiceSection;
