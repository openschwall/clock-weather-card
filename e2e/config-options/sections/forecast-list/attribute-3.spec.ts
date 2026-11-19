import { expect, test } from '../../../utils/fixtures'
import { dailyForecast, DEFAULT_DATE } from '../../../utils/test-utils'

const listConfig = (attribute3: string | null): string => `
  sections:
    forecast_list:
      forecast_type: daily
${attribute3 === null ? '' : `      attribute_3: ${attribute3}`}
`

const forecast_daily = dailyForecast(DEFAULT_DATE, ['sunny', 'cloudy', 'rainy'], i => ({ templow: 10, temperature: 20, uv_index: [3, 5.5, 0][i], precipitation: [0, 1.2, 0.4][i] }))
const VALUES = 'clock-weather-card-forecast-list-item .attribute-3'

test.describe('sections.forecast_list.attribute_3', () => {
  test('shows no extra column by default', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: listConfig(null), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(VALUES))
      .toHaveCount(0)
  })

  test('shows the attribute next to each label', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: listConfig('uv_index'), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(VALUES))
      .toHaveText(['3', '5.5', '0'])
  })

  test('shows zero precipitation as 0', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: listConfig('precipitation'), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(VALUES))
      .toHaveText(['0 mm', '1.2 mm', '0.4 mm'])
  })

  test('adds the column at runtime when the config changes (no reload)', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: listConfig(null), weather: { forecast_daily } })
    await expect(clockWeatherCard.locator(VALUES))
      .toHaveCount(0)

    await setupCard({ cardConfig: listConfig('uv_index'), weather: { forecast_daily } })

    await expect(clockWeatherCard.locator(VALUES)
      .first())
      .toHaveText('3')
  })

  test('rejects a non-string attribute', async ({ setupCard, cardErrorMessage }) => {
    await setupCard({ cardConfig: listConfig('5') })

    await cardErrorMessage()
      .toContain('Config option "sections.forecast_list.attribute_3" has invalid value "5", expected a non-empty string')
  })
})
