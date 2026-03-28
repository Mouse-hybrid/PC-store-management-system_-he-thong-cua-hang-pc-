"""
Replace Sign Up screenshot background with Sign In screenshot background.
Uses flood fill from page-gray seeds so the white card (and its borders) stays intact.
"""
from __future__ import annotations

from collections import deque

from PIL import Image

IMG_SIGNIN = r"C:\Users\T TECHVN\.cursor\projects\c-Users-T-TECHVN-Downloads-Sign-In-Sign-In\assets\c__Users_T_TECHVN_AppData_Roaming_Cursor_User_workspaceStorage_5a9fb0aab40a23153dddbc1d49fc5a7f_images__63296DAA-C701-4047-85B7-F130A7FDA373_-1a763722-779c-4ca0-b1ed-9e25bd67e1c7.png"
IMG_SIGNUP = r"C:\Users\T TECHVN\.cursor\projects\c-Users-T-TECHVN-Downloads-Sign-In-Sign-In\assets\c__Users_T_TECHVN_AppData_Roaming_Cursor_User_workspaceStorage_5a9fb0aab40a23153dddbc1d49fc5a7f_images__52B8E23C-91EB-4954-AC09-6E7B055AFBFB_-7a2627fe-f50b-429b-82d6-350bef7d0fbf.png"
OUT_PATH = r"C:\Users\T TECHVN\.cursor\projects\c-Users-T-TECHVN-Downloads-Sign-In-Sign-In\assets\signup_with_signin_background.png"


def color_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def flood_background_mask(
    pixels: list[list[tuple[int, int, int]]],
    w: int,
    h: int,
    seeds: list[tuple[int, int]],
    ref: tuple[int, int, int],
    max_dist: int = 28,
) -> list[list[bool]]:
    mask = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_add(x: int, y: int) -> None:
        if x < 0 or x >= w or y < 0 or y >= h or mask[y][x]:
            return
        if color_dist(pixels[y][x], ref) > max_dist:
            return
        mask[y][x] = True
        q.append((x, y))

    for sx, sy in seeds:
        if 0 <= sx < w and 0 <= sy < h and color_dist(pixels[sy][sx], ref) <= max_dist:
            mask[sy][sx] = True
            q.append((sx, sy))

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not mask[ny][nx]:
                if color_dist(pixels[ny][nx], ref) <= max_dist:
                    mask[ny][nx] = True
                    q.append((nx, ny))

    return mask


def main() -> None:
    signin = Image.open(IMG_SIGNIN).convert("RGB")
    signup = Image.open(IMG_SIGNUP).convert("RGB")
    w2, h2 = signup.size
    bg_layer = signin.resize((w2, h2), Image.Resampling.LANCZOS)

    pix = signup.load()
    px = [[pix[x, y] for x in range(w2)] for y in range(h2)]
    # Reference gray from page body (Sign Up)
    ref = (243, 244, 246)
    seeds: list[tuple[int, int]] = []
    for y in range(25, min(h2, h2 - 5)):
        seeds.append((5, y))
        seeds.append((15, y))
        seeds.append((w2 // 4, y))
    for x in range(0, w2, max(1, w2 // 20)):
        seeds.append((x, 35))
        seeds.append((x, 60))

    # Keep max_dist below ~29 so near-white browser chrome (254,254,254) does not connect to page gray.
    mask = flood_background_mask(px, w2, h2, seeds, ref, max_dist=22)

    out = signup.load()
    bg = bg_layer.load()
    replaced = 0
    for y in range(h2):
        for x in range(w2):
            if mask[y][x]:
                out[x, y] = bg[x, y]
                replaced += 1

    signup.save(OUT_PATH, "PNG")
    print(f"Saved: {OUT_PATH}")
    print(f"Pixels replaced: {replaced} / {w2 * h2}")


if __name__ == "__main__":
    main()
