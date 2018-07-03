'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CleanValue;

var _neo4jDriver = require('neo4j-driver');

/**
 * Convert a value to it's native type
 *
 * @param  {Object} config   Field Configuration
 * @param  {mixed}  value    Value to be converted
 * @return {mixed}
 */
function CleanValue(config, value) {
    // Clean Values
    switch (config.type) {
        case 'float':
            value = parseFloat(value);
            break;

        case 'int':
        case 'integer':
            value = parseInt(value);
            break;

        case 'bool':
        case 'boolean':
            value = !!value;
            break;

        case 'timestamp':
            value = value instanceof Date ? value.getTime() : value;
            break;

        case 'DateTime':
            value = value instanceof Date ? new _neo4jDriver.v1.types.DateTime(value.getFullYear(), value.getMonth() + 1, value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds() * 1000000, // nanoseconds
            value.getTimezoneOffset() * 60 // seconds
            ) : value;
            break;

        case 'Point':
            // SRID values: @https://neo4j.com/docs/developer-manual/current/cypher/functions/spatial/
            if (isNaN(value.x)) {
                // WGS 84
                if (isNaN(value.height)) {
                    value = new _neo4jDriver.v1.types.Point(4326, // WGS 84 2D
                    value.longitude, value.latitude);
                } else {
                    value = new _neo4jDriver.v1.types.Point(4979, // WGS 84 3D
                    value.longitude, value.latitude, value.height);
                }
            } else {
                if (isNaN(value.z)) {
                    value = new _neo4jDriver.v1.types.Point(7203, // Cartesian 2D
                    value.x, value.y);
                } else {
                    value = new _neo4jDriver.v1.types.Point(9157, // Cartesian 3D
                    value.x, value.y, value.z);
                }
            }
            break;
    }

    return value;
}