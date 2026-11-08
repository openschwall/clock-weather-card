import { expect, test } from '../../../utils/fixtures'
import { dailyForecast, DEFAULT_DATE } from '../../../utils/test-utils'

const iconConfig = (icon: string | null): string => `
  sections:
    forecast_list:
      forecast_type: daily
      attribute_2: uv_index
${icon === null ? '' : `      attribute_2_icon: ${icon}`}
`

const forecast_daily = dailyForecast(DEFAULT_DATE, ['sunny', 'cloudy'], i => ({ templow: 10, temperature: 20, uv_index: [3, 5][i] }))
const ICONS = 'clock-weather-card-forecast-list-item .attribute-2 ha-icon'

test.describe('sections.forecast_list.attribute_2_icon', () => {
  test('shows the configured icon before each value', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: iconConfig('mdi:solar-panel'), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(ICONS)
      .first())
      .toHaveAttribute('icon', 'mdi:solar-panel')
  })

  test('removes the icon at runtime when the config changes (no reload)', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: iconConfig('mdi:solar-panel'), weather: { forecast_daily } })
    await expect(clockWeatherCard.locator(ICONS)
      .first())
      .toHaveAttribute('icon', 'mdi:solar-panel')

    await setupCard({ cardConfig: iconConfig(null), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(ICONS))
      .toHaveCount(0)
  })

  test('rejects an empty icon', async ({ setupCard, cardErrorMessage }) => {
    await setupCard({ cardConfig: iconConfig('""') })

    await cardErrorMessage()
      .toContain('Config option "sections.forecast_list.attribute_2_icon" has invalid value "", expected a non-empty string')
  })
})
