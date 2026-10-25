import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useToggle } from './useCustomHooks';

describe('useToggle', () => {
  it('starts false and toggles to true', () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current[0]).toBe(false);
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
  });
});
