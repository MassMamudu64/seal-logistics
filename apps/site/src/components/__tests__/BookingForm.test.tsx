import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '../BookingForm';

describe('<BookingForm />', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        trackingId: 'SEAL-26200000-AA',
        portalUrl: 'https://x/portal/x',
      }),
    })) as unknown as typeof fetch;
  });

  it('shows inline validation errors for empty submit', async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    await user.click(screen.getByRole('button', { name: /get my quote/i }));
    expect(await screen.findAllByRole('alert')).not.toHaveLength(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits and surfaces the tracking ID on success', async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1 555 123 4567');
    await user.type(screen.getByLabelText(/estimated weight/i), '20');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /get my quote/i }));
    await waitFor(() => expect(screen.getByText('SEAL-26200000-AA')).toBeInTheDocument());
  });
});
