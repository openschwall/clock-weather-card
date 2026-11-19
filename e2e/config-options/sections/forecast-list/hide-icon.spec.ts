import { expect, test } from '../../../utils/fixtures'
import { dailyForecast, DEFAULT_DATE } from '../../../utils/test-utils'

const listConfig = (hideIcon: boolean | null): string => `
  sections:
    forecast_list:
      forecast_type: daily
${hideIcon === null ? '' : `      hide_icon: ${hideIcon}`}
`

const forecast_daily = dailyForecast(DEFAULT_DATE, ['sunny', 'cloudy'], () => ({ templow: 10, temperature: 20 }))
const ICONS = 'clock-weather-card-forecast-list-item clock-weather-card-icon'

test.describe('sections.forecast_list.hide_icon', () => {
  test('shows the weather icons by default', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: listConfig(null), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(ICONS))
      .toHaveCount(2)
  })

  test('hides the weather icons and keeps the temperatures', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: listConfig(true), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(ICONS))
      .toHaveCount(0)
    await expect(clockWeatherCard.locator('clock-weather-card-forecast-list-item .temperature-high'))
      .toHaveText(['20°C', '20°C'])
  })

  test('restores the icons at runtime when the config changes (no reload)', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: listConfig(true), weather: { forecast_daily } })
    await expect(clockWeatherCard.locator(ICONS))
      .toHaveCount(0)

    await setupCard({ cardConfig: listConfig(false), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(ICONS))
      .toHaveCount(2)
  })
})
