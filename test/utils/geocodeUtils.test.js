import Geocode from '../../src/utils/maps/geocodeUtils';

describe('browser-side Google geocoding was removed', () => {
    // These helpers called the Google Geocoding API from the browser with a key
    // hardcoded in the bundle. Consumers geocode server-side; nothing here may
    // reach Google with a key again.
    test.each(['fromLatLong', 'fromAddress', 'handleUrl'])('%s is not on the default export', (name) => {
        expect(Geocode[name]).toBeUndefined();
    });
});

describe('getCurrentLocation', () => {
    const original = Object.getOwnPropertyDescriptor(global.navigator, 'geolocation');

    const mockGeolocation = (geolocation) => {
        Object.defineProperty(global.navigator, 'geolocation', { value: geolocation, configurable: true });
    };

    afterEach(() => {
        if (original) {
            Object.defineProperty(global.navigator, 'geolocation', original);
        } else {
            delete global.navigator.geolocation;
        }
    });

    test('passes the position to onSuccess', () => {
        const position = { coords: { latitude: -33.65, longitude: 115.35 } };
        const getCurrentPosition = jest.fn((onSuccess) => onSuccess(position));
        mockGeolocation({ getCurrentPosition });
        const onSuccess = jest.fn();
        const onError = jest.fn();

        Geocode.getCurrentLocation(onSuccess, onError);

        expect(getCurrentPosition).toHaveBeenCalledWith(onSuccess, onError);
        expect(onSuccess).toHaveBeenCalledWith(position);
        expect(onError).not.toHaveBeenCalled();
    });

    test('passes a geolocation error to onError', () => {
        const error = { code: 1, message: 'User denied Geolocation' };
        mockGeolocation({ getCurrentPosition: jest.fn((onSuccess, onError) => onError(error)) });
        const onSuccess = jest.fn();
        const onError = jest.fn();

        Geocode.getCurrentLocation(onSuccess, onError);

        expect(onError).toHaveBeenCalledWith(error);
        expect(onSuccess).not.toHaveBeenCalled();
    });

    test('does nothing when the browser has no geolocation', () => {
        mockGeolocation(undefined);
        const onSuccess = jest.fn();
        const onError = jest.fn();

        expect(() => Geocode.getCurrentLocation(onSuccess, onError)).not.toThrow();
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
    });
});

describe('convertDMSToDD', () => {
    test('converts degrees, minutes and seconds to decimal degrees', () => {
        expect(Geocode.convertDMSToDD(24, 26, 24, 'N')).toBeCloseTo(24.44, 10);
        expect(Geocode.convertDMSToDD(115, 30, 0, 'E')).toBeCloseTo(115.5, 10);
    });

    test('negates south and west', () => {
        expect(Geocode.convertDMSToDD(33, 39, 0, 'S')).toBeCloseTo(-33.65, 10);
        expect(Geocode.convertDMSToDD(115, 30, 0, 'W')).toBeCloseTo(-115.5, 10);
    });

    test('treats missing parts as zero', () => {
        expect(Geocode.convertDMSToDD()).toBe(0);
        expect(Geocode.convertDMSToDD(10, null, undefined, 'N')).toBe(10);
    });
});

describe('convertDDtoDMS', () => {
    test('splits decimal degrees and picks the direction from the sign', () => {
        const lat = Geocode.convertDDtoDMS('latitude', 24.44);
        expect(lat).toMatchObject({ degrees: 24, minutes: 26, direction: 'N' });
        expect(lat.seconds).toBeCloseTo(24, 6);

        const lng = Geocode.convertDDtoDMS('longitude', -115.5);
        expect(lng).toMatchObject({ degrees: 115, minutes: 30, direction: 'W' });
        expect(lng.seconds).toBeCloseTo(0, 6);

        expect(Geocode.convertDDtoDMS('latitude', -33.65).direction).toBe('S');
        expect(Geocode.convertDDtoDMS('longitude', 115.35).direction).toBe('E');
    });

    test('leaves the direction empty for any other name', () => {
        expect(Geocode.convertDDtoDMS('altitude', 12.5).direction).toBe('');
    });

    test.each([
        ['latitude', 24.44],
        ['latitude', -33.6512],
        ['longitude', 115.3471],
        ['longitude', -179.9999],
    ])('round-trips %s %d through convertDMSToDD', (name, dd) => {
        const { degrees, minutes, seconds, direction } = Geocode.convertDDtoDMS(name, dd);
        expect(Geocode.convertDMSToDD(degrees, minutes, seconds, direction)).toBeCloseTo(dd, 10);
    });
});

describe('getAddress', () => {
    test('returns an empty address for no components', () => {
        const empty = { province: '', city: '', country: '', code: '', line1: '', line2: '' };
        expect(Geocode.getAddress()).toEqual(empty);
        expect(Geocode.getAddress([])).toEqual(empty);
    });

    test('maps geocoder address components onto the address fields', () => {
        const components = [
            { types: ['street_number'], long_name: '12' },
            { types: ['route'], long_name: 'Queen Street' },
            { types: ['locality', 'political'], long_name: 'Busselton' },
            { types: ['administrative_area_level_2'], long_name: 'City of Busselton' },
            { types: ['administrative_area_level_1'], long_name: 'Western Australia' },
            { types: ['country'], long_name: 'Australia' },
            { types: ['postal_code'], long_name: '6280' },
        ];
        expect(Geocode.getAddress(components)).toEqual({
            line1: '12 Queen Street',
            line2: 'Busselton',
            city: 'City of Busselton',
            province: 'Western Australia',
            country: 'AUSTRALIA',
            code: '6280',
        });
    });
});

describe('isValidLatitute', () => {
    test.each(['0', '90', '-90', '+90', '90.000000', '89.999999999', '-33.6512', 45, -45.5])('accepts %s', (value) => {
        expect(Geocode.isValidLatitute(value)).toBe(true);
    });

    test.each(['90.1', '-90.000001', '91', '-91', '100', '90.0000000', 'abc', '', null, undefined])('rejects %s', (value) => {
        expect(Geocode.isValidLatitute(value)).toBe(false);
    });
});

describe('isValidLongitute', () => {
    test.each(['0', '180', '-180', '+180', '180.000000', '179.999999999', '115.3471', 99, -179.5])('accepts %s', (value) => {
        expect(Geocode.isValidLongitute(value)).toBe(true);
    });

    test.each(['180.1', '-180.000001', '181', '-181', '200', '180.0000000', 'abc', '', null, undefined])('rejects %s', (value) => {
        expect(Geocode.isValidLongitute(value)).toBe(false);
    });
});
