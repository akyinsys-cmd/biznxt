const fs = require('fs');
let blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

blueprint.entities["ServiceCatalogEntry"] = {
  "title": "Service Catalog Entry",
  "description": "Definition of a specialized premium service offering.",
  "type": "object",
  "properties": {
    "service_id": { "type": "string" },
    "service_name": { "type": "string" },
    "category": { "type": "string" },
    "subCategory": { "type": "string" },
    "description": { "type": "string" },
    "price": { "type": "number" },
    "discount": { "type": "number" },
    "benchmark_price": { "type": "number", "description": "Standard market baseline price" },
    "biznxt_price": { "type": "number", "description": "BizNxt premium configured price" },
    "premium_features_list": {
      "type": "array",
      "items": { "type": "string" }
    },
    "deliverables": { "type": "string" },
    "timeline": { "type": "string" },
    "requiredDocuments": { "type": "string" },
    "isActive": { "type": "boolean" },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "required": ["service_id", "service_name", "benchmark_price"]
};

if (!blueprint.firestore) blueprint.firestore = {};
if (!blueprint.firestore["service_catalog/{serviceId}"]) {
  blueprint.firestore["service_catalog/{serviceId}"] = {
    "schema": { "$ref": "#/entities/ServiceCatalogEntry" },
    "description": "Premium dynamic service catalog entries with benchmark and specialized pricing."
  };
}

fs.writeFileSync('firebase-blueprint.json', JSON.stringify(blueprint, null, 2));
