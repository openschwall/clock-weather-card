import type { WeatherForecast } from '../../../../src/types'
import { expect, test } from '../../../utils/fixtures'

const FIXED_NOW = new Date('2025-09-14T18:30:00+00:00')
const FORECAST_HOURLY: (WeatherForecast & Record<string, unknown>)[] = [
  { datetime: '2025-09-14T18:00:00+00:00', condition: 'sunny', temperature: 20, precipitation_probability: 30, wind_speed: 12.4, precipitation: 0 },
  { datetime: '2025-09-14T19:00:00+00:00', condition: 'cloudy', temperature: 19, precipitation_probability: 50, wind_speed: 8, precipitation: 0.44 },
  { datetime: '2025-09-14T20:00:00+00:00', condition: 'rainy', temperature: 18, precipitation_probability: 70, precipitation: 1.2 },
]

const stripConfig = (attribute2: string | null): string => `
  sections:
    forecast_strip:
      hide_sunrise_sunset: true
${attribute2 === null ? '' : `      attribute_3: ${attribute2}`}
`

const SECOND = 'clock-weather-card-forecast-strip-item .attribute--third'

test.describe('sections.forecast_strip.attribute_3', () => {
  test('shows no third row by default', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ date: FIXED_NOW, weather: { forecast_hourly: FORECAST_HOURLY } })

    await expect(clockWeatherCard.locator(SECOND))
      .toHaveCount(0)
  })

  test('shows the third attribute below the temperature, leaving zero precipitation blank', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ date: FIXED_NOW, cardConfig: stripConfig('precipitation'), weather: { forecast_hourly: FORECAST_HOURLY } })

    await expect(clockWeatherCard.locator('clock-weather-card-forecast-strip-item .attribute:not(.attribute--third)'))
      .toHaveText(['30%', '50%', '70%'])
    await expect(clockWeatherCard.locator(SECOND))
      .toHaveText(['', '0.44 mm', '1.2 mm'])
  })

  test('shows the third attribute while the first is hidden', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({
      date: FIXED_NOW,
      cardConfig: `
        sections:
          forecast_strip:
            hide_sunrise_sunset: true
            hide_attribute: true
            attribute_3: wind_speed
      `,
      weather: { forecast_hourly: FORECAST_HOURLY },
    })

    await expect(clockWeatherCard.locator('clock-weather-card-forecast-strip-item .attribute'))
      .toHaveText(['12.4 km/h', '8 km/h', ''])
  })

  test('adds the third attribute at runtime when the config changes (no reload)', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ date: FIXED_NOW, weather: { forecast_hourly: FORECAST_HOURLY } })
    await expect(clockWeatherCard.locator(SECOND))
      .toHaveCount(0)

    await setupCard({ date: FIXED_NOW, cardConfig: stripConfig('wind_speed'), weather: { forecast_hourly: FORECAST_HOURLY } })

    await expect(clockWeatherCard.locator(SECOND)
      .first())
      .toHaveText('12.4 km/h')
  })

  test('rejects a non-string attribute', async ({ setupCard, cardErrorMessage }) => {
    await setupCard({ cardConfig: stripConfig('5') })

    await cardErrorMessage()
      .toContain('Config option "sections.forecast_strip.attribute_3" has invalid value "5", expected a non-empty string')
  })
})
