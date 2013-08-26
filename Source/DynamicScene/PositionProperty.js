/*global define*/
define([
        '../Core/Cartesian3',
        '../Core/defined',
        '../Core/defineProperties',
        '../Core/DeveloperError',
        '../Core/Matrix3',
        '../Core/ReferenceFrame',
        '../Core/Transforms'
    ], function(
        Cartesian3,
        defined,
        defineProperties,
        DeveloperError,
        Matrix3,
        ReferenceFrame,
        Transforms) {
    "use strict";

    function throwInstantiationError() {
        throw new DeveloperError('This type should not be instantiated directly.');
    }

    /**
     * The interface for all position {@link Property} objects. Position properties
     * represent a world location as a {@link Cartesian3} with an associated
     * {@link ReferenceFrame}.
     * This type defines an interface and cannot be instantiated directly.
     *
     * @alias PositionProperty
     * @constructor
     *
     * @see CompositePositionProperty
     * @see ConstantPositionProperty
     * @see SampledPositionProperty
     * @see TimeIntervalCollectionPositionProperty
     */
    var PositionProperty = throwInstantiationError;

    defineProperties(PositionProperty.prototype, {
        /**
         * Gets the reference frame that the position is defined in.
         * @memberof PositionProperty.prototype
         * @Type {ReferenceFrame}
         */
        referenceFrame : {
            get : function() {
                throwInstantiationError();
            }
        }
    });

    /**
     * Gets the value of the property at the provided time.
     * @memberof PositionProperty
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Cartesian3} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3} The modified result parameter or a new instance if the result parameter was not supplied.
     *
     * @exception {DeveloperError} time is required.
     */
    PositionProperty.prototype.getValue = throwInstantiationError;

    /**
     * Gets the value of the property at the provided time and in the provided reference frame.
     * @memberof PositionProperty
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {ReferenceFrame} referenceFrame The desired referenceFrame of the result.
     * @param {Cartesian3} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3} The modified result parameter or a new instance if the result parameter was not supplied.
     *
     * @exception {DeveloperError} time is required.
     * @exception {DeveloperError} referenceFrame is required.
     */
    PositionProperty.prototype.getValueInReferenceFrame = throwInstantiationError;

    var scratchMatrix3 = new Matrix3();

    /**
     * @private
     */
    PositionProperty.convertToReferenceFrame = function(time, value, inputFrame, outputFrame, result) {
        if (inputFrame === outputFrame) {
            return Cartesian3.clone(value, result);
        }

        var icrfToFixed = Transforms.computeIcrfToFixedMatrix(time, scratchMatrix3);
        if (!defined(icrfToFixed)) {
            icrfToFixed = Transforms.computeTemeToPseudoFixedMatrix(time, scratchMatrix3);
        }
        if (inputFrame === ReferenceFrame.INERTIAL) {
            return icrfToFixed.multiplyByVector(value, result);
        }
        if (inputFrame === ReferenceFrame.FIXED) {
            return icrfToFixed.transpose(scratchMatrix3).multiplyByVector(value, result);
        }
    };

    return PositionProperty;
});