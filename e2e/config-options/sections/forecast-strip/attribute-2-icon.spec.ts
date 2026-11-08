import { expect, test } from '../../../utils/fixtures'

const attribute2Icon = (icon: string | null): string => `
  sections:
    forecast_strip:
      attribute_2: precipitation_probability
${icon === null ? '' : `      attribute_2_icon: ${icon}`}
`

test.describe('sections.forecast_strip.attribute_2_icon', () => {
  test('shows the configured icon next to each value of the second row', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: attribute2Icon('mdi:umbrella') })

    await expect(clockWeatherCard.locator('clock-weather-card-forecast-strip-item .attribute--second')
      .first()
      .locator('ha-icon'))
      .toHaveAttribute('icon', 'mdi:umbrella')
  })

  test('swaps the icon at runtime when the config changes (no reload)', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: attribute2Icon('mdi:umbrella') })
    const icons = clockWeatherCard.locator('clock-weather-card-forecast-strip-item .attribute--second ha-icon')
    await expect(icons.first())
      .toHaveAttribute('icon', 'mdi:umbrella')

    await setupCard({ cardConfig: attribute2Icon(null) })

    await expect(icons)
      .toHaveCount(0)
  })

  test('rejects an empty icon', async ({ setupCard, cardErrorMessage }) => {
    await setupCard({ cardConfig: attribute2Icon('""') })

    await cardErrorMessage()
      .toContain('Config option "sections.forecast_strip.attribute_2_icon" has invalid value "", expected a non-empty string')
  })
})
